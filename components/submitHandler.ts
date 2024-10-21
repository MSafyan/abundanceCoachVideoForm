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
