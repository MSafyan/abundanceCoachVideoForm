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
      amtPointsRequired: undefined,
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

  const getButtonText = () => {
    if (isUploading || isUploadingVimeo) return "Uploading...";
    if (isSubmitting) return "Submitting...";
    return "Submit";
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isVimeoAuthenticated && values.videoHostedOn === "vimeoPersonal") {
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

    await handleSubmit(
      values,
      setIsSubmitting,
      setShowSuccessModal,
      setShowConfetti,
      form
    );
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
              />
              {(isEmailVerified || isVimeoAuthenticated) && (
                <>
                  <VideoDetailsFields form={form} categories={categories} />
                  <ContentFields
                    form={form}
                    handleVimeoAuth={handleVimeoAuth}
                    isVimeoAuthenticated={isVimeoAuthenticated}
                  />
                  <FileUploadFields form={form} />
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
