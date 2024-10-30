import React, { useState } from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useFileUpload } from "../hooks/usefileUpload";

const VideoUploadField = ({ form }: { form: any }) => {
  const { isUploadingVimeo, uploadProgress, handleFileChange } =
    useFileUpload();

  const [video, setVideo] = useState<File | null>(null);

  return (
    <FormItem>
      <FormLabel>
        Please Upload Your Video If you don't have Video Link
      </FormLabel>
      <FormControl>
        <Input
          type="file"
          name="video"
          onChange={(e) => handleFileChange(e, setVideo, "video", form)}
          accept="video/*"
          disabled={isUploadingVimeo}
        />
      </FormControl>
      <FormDescription>
        {isUploadingVimeo
          ? "Uploading..."
          : "Max file size is 500MB. Video will be uploaded to Vimeo."}
      </FormDescription>
      {isUploadingVimeo && (
        <div className="mt-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-500 mt-1">
            {uploadProgress.toFixed(2)}% uploaded
          </p>
        </div>
      )}
    </FormItem>
  );
};

export default VideoUploadField;
