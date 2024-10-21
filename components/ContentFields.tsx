import React from "react";
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
import VideoUploadField from "./VideoUploadField";

export const ContentFields = ({ form }: { form: any }) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Link</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/your-video" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <VideoUploadField form={form} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
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
