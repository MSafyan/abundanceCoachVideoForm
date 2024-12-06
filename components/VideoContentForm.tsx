"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactConfetti from "react-confetti";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { formSchema } from "./formSchema";
import { VideoDetailsFields } from "./VideoDetailsFields";
import { SuccessModal } from "./SuccessModal";
import { handleSubmit } from "./submitHandler";
import { ContentFields } from "./ContentFields";
import { FileUploadFields } from "./FileUploadFields";
import { useCategories } from "@/hooks/useCategories";
import { useFileUpload } from "@/hooks/usefileUpload";
import { toast } from "@/hooks/use-toast";
import { useAppContext } from "@/app/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { formatKeywordsToArray } from "@/utils/formatHelpers";
import { UPDATABLE_FIELDS } from "./constants";

export default function VideoContentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const { categories } = useCategories();
  const { isUploading, isUploadingVimeo } = useFileUpload();
  const { isVimeoAuthenticated, setIsVimeoAuthenticated } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const isUpdate = searchParams.get("update") === "true";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      categoryIds: "",
      title: "",
      unlockCriteria: ["public"],
      description: "",
      videoHostedOn: "vimeoWesion",
      url: "",
      keywords: [],
      tagNames: [],
      transcript: "",
      thumbnail: "",
      supplementalMaterialUrl: "",
    },
  });

  useEffect(() => {
    // Check if we're returning from Vimeo authentication
    const isReturningFromVimeo = searchParams.get("vimeoAuth") === "success";

    if (isReturningFromVimeo) {
      // Restore form data from localStorage
      const savedFormData = localStorage.getItem("videoContentFormData");
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        form.reset(parsedData);

        localStorage.removeItem("videoContentFormData");
      }

      // Remove the query parameter
      router.replace("/", { scroll: false });
    }
  }, []);

  useEffect(() => {
    // Check if the user is authenticated with Vimeo
    const checkVimeoAuth = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `/api/vimeoAuth/status?userId=${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to check Vimeo auth status");
          }
          const data = await response.json();
          setIsVimeoAuthenticated(data.data?.isAuthenticated);
        } catch (error) {
          console.error("Error checking Vimeo auth status:", error);
          // toast({
          //   title: "Error",
          //   description: "Failed to check Vimeo authentication status.",
          //   variant: "destructive",
          // });
        }
      }
    };

    checkVimeoAuth();
  }, [userId]);

  useEffect(() => {
    if (videoId && isUpdate) {
      // Fetch video details
      const fetchVideoDetails = async () => {
        try {
          const response = await fetch(`/api/admin/videos/${videoId}`);
          if (!response.ok) throw new Error("Failed to fetch video details");

          const data = await response.json();
          if (data.success) {
            // Transform the data to match form structure
            const formData = {
              email: data.data.user.email,
              title: data.data.title,
              description: data.data.description,
              unlockCriteria: data.data.unlockCriteria,
              amtPointsRequired: data.data.amtPointsRequired,
              categoryIds: data.data.categories[0]?.id.toString() || "",
              tagNames: data.data.tags.map((tag: any) => tag.tag),
              videoHostedOn: data.data.videoHostedOn || "vimeoWesion",
              url: data.data.url || "",
              keywords: formatKeywordsToArray(data.data.videoDetail?.keywords),
              transcript: data.data.videoDetail?.transcript || "",
              supplementalMaterialUrl:
                data.data.videoDetail?.supplementalMaterialUrl || "",
            };

            // // Store form data for initialization
            // localStorage.setItem(
            //   "updateFormInitialBody",
            //   JSON.stringify(formData)
            // );

            // Reset form with fetched data
            form.reset(formData);
          }
        } catch (error) {
          console.error("Error fetching video details:", error);
          toast({
            title: "Error",
            description: "Failed to fetch video details",
            variant: "destructive",
          });
        }
      };

      fetchVideoDetails();
    }
  }, [searchParams]);

  const getButtonText = () => {
    if (isUploading || isUploadingVimeo) return "Uploading...";
    if (isSubmitting) return "Submitting...";
    return "Submit";
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    debugger;
    if (
      !isVimeoAuthenticated &&
      values.videoHostedOn === "vimeoPersonal" &&
      !isUpdate
    ) {
      toast({
        title: "Error",
        description: "Please authenticate with Vimeo first.",
        variant: "destructive",
      });
      return;
    }

    if (isUploading || isUploadingVimeo) {
      toast({
        title: "Error",
        description: "Please wait for the upload to complete.",
        variant: "destructive",
      });
      return;
    }
    const updatableValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => UPDATABLE_FIELDS.includes(key))
    );

    if (isUpdate) {
      try {
        setIsSubmitting(true);
        const response = await fetch(`/api/admin/videos/${videoId}/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatableValues,
            categoryIds: [parseInt(values.categoryIds)],
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: "Video updated successfully",
          });
          router.push(`/admin`);
          // Clear stored data
          // localStorage.removeItem("updateFormInitialBody");
        } else {
          throw new Error(data.message);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update video",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Existing submit logic for new video
      await handleSubmit(
        values,
        setIsSubmitting,
        setShowSuccessModal,
        setShowConfetti,
        form
      );
    }
  };

  const handleVimeoAuth = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please verify your email first.",
        variant: "destructive",
      });
      return;
    }

    // Save form data to localStorage before redirecting
    localStorage.setItem(
      "videoContentFormData",
      JSON.stringify(form.getValues())
    );

    try {
      const response = await fetch(`/api/vimeoAuth?userId=${userId}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.data) {
        window.location.href = data.data;
      } else {
        throw new Error("Failed to get Vimeo authentication URL");
      }
    } catch (error) {
      console.error("Error initiating Vimeo authentication:", error);
      toast({
        title: "Authentication Error",
        description:
          "Failed to initiate Vimeo authentication. Please try again.",
        variant: "destructive",
      });
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
              <PersonalInfoFields
                form={form}
                setIsEmailVerified={setIsEmailVerified}
                setUserId={setUserId}
                userId={userId}
                isUpdateMode={isUpdate}
              />
              {(isUpdate || isEmailVerified || isVimeoAuthenticated) && (
                <>
                  <VideoDetailsFields
                    form={form}
                    categories={categories}
                    isUpdateMode={isUpdate}
                  />
                  <ContentFields
                    form={form}
                    handleVimeoAuth={handleVimeoAuth}
                    isVimeoAuthenticated={isVimeoAuthenticated}
                    isUpdateMode={isUpdate}
                  />
                  <FileUploadFields form={form} isUpdateMode={isUpdate} />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isUploading || isUploadingVimeo || isSubmitting}
                  >
                    {getButtonText()}
                  </Button>
                </>
              )}
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
