import { toast } from "@/hooks/use-toast";

export const handleSubmit = async (
  values: any,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setShowSuccessModal: (showSuccessModal: boolean) => void,
  setShowConfetti: (showConfetti: boolean) => void,
  form: any
) => {
  console.log("onSubmit function called");
  console.log("Form errors:", form.formState.errors); // Add this line
  try {
    setIsSubmitting(true);

    // Ensure keywords is an array
    const keywords = Array.isArray(values.keywords) ? values.keywords : [];

    // Prepare the form data
    const formData = {
      ...values,
      keywords, // This ensures we always send an array
      categoryIds: [parseInt(values.categoryIds)],
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

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    if (data.success) {
      setShowSuccessModal(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      form.reset();
    } else {
      throw new Error(data.message || "Submission failed");
    }
  } catch (error: any) {
    console.error("Error submitting video details:", error);
    toast({
      title: "Error",
      description:
        error.message || "Failed to submit video details. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
