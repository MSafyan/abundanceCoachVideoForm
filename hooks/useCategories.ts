import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export interface Category {
  id: number;
  category: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

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

  return { categories };
};
