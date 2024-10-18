"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { TagInput } from "./ui/tag-input";
import * as tus from "tus-js-client";
import { Progress } from "@/components/ui/progress";
import ReactConfetti from "react-confetti";
import { X } from "lucide-react"; // For the close button

// Add this constant at the top of your file, after the imports
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes
const MAX_FILE_SIZE_OTHER = 20 * 1024 * 1024; // 20MB for other files

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  categoryIds: z.string({
    required_error: "Category is required.",
  }),
  title: z.string().min(5, {
    message: "Video title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Video description must be at least 10 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  keywords: z.array(z.string()),
  tagNames: z.array(z.string()),
  transcript: z.string(),
  thumbnail: z.string().optional(),
  supplementalMaterialUrl: z.string().optional(),
  unlockCriteria: z.enum(["public", "accountabilityPartner", "amtPoints"]),
  amtPointsRequired: z.number().optional(),
});

interface Category {
  id: number;
  category: string;
}

// Add this new component for the success modal
const SuccessModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-600">Success!</h2>
        <p className="text-lg mb-4">
          Your video content application has been submitted successfully!
        </p>
        <p className="text-md mb-4">
          You're one step closer to becoming one of our first facilitators.
          We'll review your application and get back to you soon.
        </p>
        <button
          onClick={onClose}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function VideoContentForm() {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [supplementalMaterial, setSupplementalMaterial] = useState<File | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVimeo, setIsUploadingVimeo] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAmtPointsRequired, setShowAmtPointsRequired] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/videoCategories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to fetch video categories. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      categoryIds: "",
      title: "",
      description: "",
      url: "",
      keywords: [],
      tagNames: [],
      transcript: "",
      thumbnail: "",
      supplementalMaterialUrl: "",
      unlockCriteria: "public",
      amtPointsRequired: undefined,
    },
  });

  const uploadFile = async (file: File, label: string) => {
    setIsUploading(true);
    try {
      console.log("uploading file", file);
      const signedUrlResponse = await fetch("/api/files/signed-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          label: label,
        }),
      });

      console.log("signedUrlResponse", signedUrlResponse);

      // const signedUrl = "";
      const signedurlData = await signedUrlResponse.json();
      console.log("signedUrl", signedurlData);

      const uploadResponse = await fetch(
        `/api/files/upload?signedUrl=${encodeURIComponent(signedurlData.data)}`,
        {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      const { data } = await uploadResponse.json();
      return data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description:
          "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    label: string
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Check file size based on file type
      const maxSize = label === "video" ? MAX_FILE_SIZE : MAX_FILE_SIZE_OTHER;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `The file size should not exceed ${
            maxSize / (1024 * 1024)
          }MB.`,
          variant: "destructive",
        });
        // Reset the input
        event.target.value = "";
        return;
      }

      setter(file);

      if (label === "video") {
        await uploadVideoToVimeo(file);
      } else {
        setIsUploading(true);
        try {
          const fileUrl = await uploadFile(file, label);
          if (label === "thumbnail") {
            form.setValue("thumbnail", fileUrl);
          } else if (label === "supplementalMaterial") {
            form.setValue("supplementalMaterialUrl", fileUrl);
          }
        } catch (error) {
          console.error(`Error uploading ${label}:`, error);
        } finally {
          setIsUploading(false);
        }
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("onSubmit function called");
    console.log("Form errors:", form.formState.errors); // Add this line
    try {
      setIsSubmitting(true);

      // convert categoryIds to number from string
      // @ts-ignore
      values.categoryIds = [parseInt(values.categoryIds)];

      // Prepare the form data
      const formData = {
        ...values,
        thumbnail: form.getValues("thumbnail"),
        supplementalMaterialUrl: form.getValues("supplementalMaterialUrl"),
      };

      console.log("formData", formData);

      // Send the form data to the API route
      const response = await fetch("/api/admin/videoDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit video details");
      }

      const result = await response.json();

      if (result.success) {
        setShowSuccessModal(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
        form.reset();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting video details:", error);
      toast({
        title: "Error",
        description: "Failed to submit video details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadVideoToVimeo = async (file: File) => {
    setIsUploadingVimeo(true);
    setUploadProgress(0);

    try {
      // Step 1: Create a new video on Vimeo
      const createResponse = await fetch("/api/vimeo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create video on Vimeo");
      }

      const { upload_link, link } = await createResponse.json();

      const upload = new tus.Upload(file, {
        // Use Vimeo's provided `upload_link` directly
        endpoint: upload_link,
        uploadUrl: upload_link, // Directly using the PATCH method on this URL
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onError: function (error) {
          console.error("Failed because: " + error);
          toast({
            title: "Upload failed",
            description:
              "There was an error uploading your video. Please try again.",
            variant: "destructive",
          });
          setIsUploadingVimeo(false);
          setUploadProgress(0);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(bytesUploaded, bytesTotal, percentage + "%");
          setUploadProgress(parseFloat(percentage));
        },
        onSuccess: function () {
          console.log("Download %s from %s", file.name, upload.url);
          toast({
            title: "Video uploaded successfully",
            description: "Your video has been uploaded to Vimeo.",
          });
          form.setValue("url", link);
          setIsUploadingVimeo(false);
          setUploadProgress(0);
        },
      });

      // Start the upload
      upload.start();
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload failed",
        description:
          "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
      setIsUploadingVimeo(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Video Content Application Form
          </CardTitle>
          <CardDescription>
            Super Exciting News! Our Long Awaited Beta Feature Release Is Coming
            Really Soon! Apply Below To Be One Of Our First Facilitators To Get
            Eyeballs On Your Premium Video Content!
          </CardDescription>
          <p className="font-semibold mt-4">
            The First 111 Successful Applications Will Get Access To FREE
            Premium Features For Life!
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered Wesion Account Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unlockCriteria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unlock Criteria</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setShowAmtPointsRequired(value === "amtPoints");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unlock criteria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="accountabilityPartner">
                            Accountability Partner
                          </SelectItem>
                          <SelectItem value="amtPoints">AMT Points</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {showAmtPointsRequired && (
                <FormField
                  control={form.control}
                  name="amtPointsRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AMT Points Required</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter required AMT points"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your video title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your video description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/your-video"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>
                    Please Upload Your Video If you don't have Video Link
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      name="video"
                      onChange={(e) => handleFileChange(e, setVideo, "video")}
                      accept="video/*"
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormDescription>
                    {isUploading
                      ? "Uploading..."
                      : "Max file size is 500MB. Video will be uploaded to Vimeo."}
                  </FormDescription>
                  {isUploadingVimeo && (
                    <div className="mt-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-gray-500 mt-1">
                        {uploadProgress.toFixed(2)}% uploaded
                      </p>
                    </div>
                  )}
                </FormItem>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>
                    Please Upload Your Video's Thumbnail Image
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, setThumbnail, "thumbnail")
                      }
                      accept="image/*"
                    />
                  </FormControl>
                  <FormDescription>Max file size is 20MB</FormDescription>
                </FormItem>
                <FormItem>
                  <FormLabel>
                    Please add any supplemental materials for your video like
                    pdf workbooks, audio's etc here
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          setSupplementalMaterial,
                          "supplementalMaterial"
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>Max file size is 20MB</FormDescription>
                </FormItem>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Keywords</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Type a keyword and press Enter"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter keywords for your video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagNames"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Tags</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Type a tag and press Enter"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter tags for your video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="transcript"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Video Captions/Transcript If Available
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter video captions or transcript"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isUploading || isSubmitting}
              >
                {isUploading
                  ? "Uploading..."
                  : isSubmitting
                  ? "Submitting..."
                  : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {showConfetti && <ReactConfetti recycle={false} />}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}

// function VideoContentForm() {
//   return <></>;
// }

// export default VideoContentForm;
