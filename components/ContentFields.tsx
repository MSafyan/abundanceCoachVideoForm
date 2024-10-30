import React, { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import VideoUploadField from "./VideoUploadField";
import { Button } from "@/components/ui/button";

export const ContentFields = ({
  form,
  handleVimeoAuth,
  isVimeoAuthenticated,
}: {
  form: any;
  handleVimeoAuth: () => void;
  isVimeoAuthenticated: boolean;
}) => {
  const [showVimeoAuthButton, setShowVimeoAuthButton] = useState(false);

  useEffect(() => {
    const videoHostedOn = form.watch("videoHostedOn");
    setShowVimeoAuthButton(videoHostedOn === "vimeoPersonal");
  }, [form.watch("videoHostedOn")]);

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter your video title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter your video description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="videoHostedOn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Hosted On</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vimeoWesion" id="vimeoWesion" />
                  <Label htmlFor="vimeoWesion">Video File</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vimeoPersonal" id="vimeoPersonal" />
                  <Label htmlFor="vimeoPersonal">Personal Vimeo Account</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="youtube" id="youtube" />
                  <Label htmlFor="youtube">YouTube</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="others" id="others" />
                  <Label htmlFor="others">Others</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {form.watch("videoHostedOn") === "vimeoWesion" ? (
        <VideoUploadField form={form} />
      ) : (
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/your-video"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {!isVimeoAuthenticated && showVimeoAuthButton && (
        <Button type="button" onClick={handleVimeoAuth} className="mt-2">
          Authenticate with Vimeo
        </Button>
      )}
      <FormField
        control={form.control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Keywords</FormLabel>
            <FormControl>
              <TagInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Type a keyword and press Enter"
              />
            </FormControl>
            <FormDescription>Enter keywords for your video</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tagNames"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Tags</FormLabel>
            <FormControl>
              <TagInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Type a tag and press Enter"
              />
            </FormControl>
            <FormDescription>Enter tags for your video</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="transcript"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Captions/Transcript If Available</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter video captions or transcript"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
