import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PersonalInfoFieldsProps {
  form: any;
  setIsEmailVerified: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  form,
  setIsEmailVerified,
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const checkEmail = async () => {
    setIsChecking(true);
    const email = form.getValues("email");

    try {
      const response = await fetch(
        `/api/users/find-by-email?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (data.success) {
        setIsEmailVerified(true);
        toast({
          title: "Email Verified",
          description: "You can now proceed with the form.",
        });
      } else {
        setIsEmailVerified(false);
        toast({
          title: "Email Not Found",
          description:
            "Please register on the Wesion platform first and use that email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking email:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while verifying your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registered Wesion Account Email</FormLabel>
            <FormControl>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                  disabled={form.getValues("email") && !isChecking}
                />
                <Button
                  type="button"
                  onClick={checkEmail}
                  disabled={isChecking || !form.getValues("email")}
                >
                  {isChecking ? "Checking..." : "Verify Email"}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
