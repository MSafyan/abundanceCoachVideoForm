import React, { useState } from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFileUpload } from "../hooks/usefileUpload";

export const FileUploadFields = ({ form }: { form: any }) => {
  const { handleFileChange } = useFileUpload();

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [supplementalMaterial, setSupplementalMaterial] = useState<File | null>(
    null
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormItem>
        <FormLabel>Please Upload Your Video's Thumbnail Image</FormLabel>
        <FormControl>
          <Input
            type="file"
            onChange={(e) =>
              handleFileChange(e, setThumbnail, "thumbnail", form)
            }
            accept="image/*"
          />
        </FormControl>
        <FormDescription>Max file size is 20MB</FormDescription>
      </FormItem>
      <FormItem>
        <FormLabel>
          Please add any supplemental materials for your video like pdf
          workbooks, audio's etc here
        </FormLabel>
        <FormControl>
          <Input
            type="file"
            onChange={(e) =>
              handleFileChange(
                e,
                setSupplementalMaterial,
                "supplementalMaterial",
                form
              )
            }
          />
        </FormControl>
        <FormDescription>Max file size is 20MB</FormDescription>
      </FormItem>
    </div>
  );
};
