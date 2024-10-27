// app/vimeoCallback/page.tsx
"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useAppContext } from "../context/AppContext";

export default function VimeoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);
  const { setIsVimeoAuthenticated } = useAppContext();

  useEffect(() => {
    const processCallback = async () => {
      if (hasProcessed.current) return;

      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code || !state) {
        toast({
          title: "Authentication Error",
          description: "Missing required parameters from Vimeo.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      try {
        hasProcessed.current = true; // Mark as processed before the API call
        const response = await fetch(
          `/api/vimeoAuth/callback?code=${code}&state=${state}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          toast({
            title: "Authentication Successful",
            description: "Your Vimeo account has been successfully linked.",
          });
          // Redirect to home page after successful authentication
          setIsVimeoAuthenticated(true);
          router.push("/?vimeoAuth=success");
        } else {
          throw new Error(data.message || "Failed to authenticate with Vimeo");
        }
      } catch (error) {
        console.error("Error processing Vimeo callback:", error);
        toast({
          title: "Authentication Error",
          description:
            "Failed to complete Vimeo authentication. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, router]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Processing Vimeo Authentication
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return null;
}
