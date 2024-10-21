import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import * as tus from "tus-js-client";

// Add this constant at the top of your file, after the imports
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes
const MAX_FILE_SIZE_OTHER = 20 * 1024 * 1024; // 20MB for other files

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVimeo, setIsUploadingVimeo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File) => void,
    label: string,
    form: any
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
        await uploadVideoToVimeo(
          file,
          setIsUploadingVimeo,
          setUploadProgress,
          form
        );
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

  const uploadVideoToVimeo = async (
    file: File,
    setIsUploadingVimeo: (isUploading: boolean) => void,
    setUploadProgress: (progress: number) => void,
    form: any
  ) => {
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

  return {
    isUploading,
    isUploadingVimeo,
    uploadProgress,
    setUploadProgress,
    handleFileChange,
    uploadVideoToVimeo,
    uploadFile,
  };
};
