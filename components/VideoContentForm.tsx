"use client";

import { useState } from "react";
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

export default function VideoContentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isVimeoAuthenticated, setIsVimeoAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { categories } = useCategories();
  const { isUploading } = useFileUpload();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      categoryIds: "",
      title: "",
      description: "",
      videoHostedOn: "vimeoWesion",
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await handleSubmit(
      values,
      setIsSubmitting,
      setShowSuccessModal,
      setShowConfetti,
      form
    );
  };

  const handleVimeoAuth = async () => {
    try {
      const response = await fetch("/api/vimeoAuth", { method: "GET" });
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
              />
              {isEmailVerified && (
                <>
                  <VideoDetailsFields form={form} categories={categories} />
                  <ContentFields
                    form={form}
                    handleVimeoAuth={handleVimeoAuth}
                  />
                  <FileUploadFields form={form} />
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
