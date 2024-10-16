"use client"

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  contentType: z.string({
    required_error: "Please choose your content type.",
  }),
  videoTitle: z.string().min(5, {
    message: "Video title must be at least 5 characters.",
  }),
  videoDescription: z.string().min(10, {
    message: "Video description must be at least 10 characters.",
  }),
  videoLink: z.string().url({
    message: "Please enter a valid URL.",
  }),
  videoKeywords: z.string(),
  videoTags: z.string(),
  videoCaptions: z.string(),
})

export default function VideoContentForm() {
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [supplementalMaterial, setSupplementalMaterial] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      category: "",
      contentType: "",
      videoTitle: "",
      videoDescription: "",
      videoLink: "",
      videoKeywords: "",
      videoTags: "",
      videoCaptions: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    console.log('Thumbnail:', thumbnail)
    console.log('Video:', video)
    console.log('Supplemental Material:', supplementalMaterial)
    // Here you would typically send the form data to your backend
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0])
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Video Content Application Form</CardTitle>
        <CardDescription>
          Super Exciting News! Our Long Awaited Beta Feature Release Is Coming Really Soon! Apply Below To Be One Of Our First Facilitators To Get Eyeballs On Your Premium Video Content!
        </CardDescription>
        <p className="font-semibold mt-4">
          The First 111 Successful Applications Will Get Access To FREE Premium Features For Life!
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registered Wesion Account Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please choose your content type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="vlog">Vlog</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="videoTitle"
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
              name="videoDescription"
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
            <FormItem>
              <FormLabel>Please Upload Your Video's Thumbnail Image</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => handleFileChange(e, setThumbnail)} accept="image/*" />
              </FormControl>
              <FormDescription>Max file size is 20 MB</FormDescription>
            </FormItem>
            <FormField
              control={form.control}
              name="videoLink"
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
            <FormItem>
              <FormLabel>Please Upload Your Video If Applicable</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => handleFileChange(e, setVideo)} accept="video/*" />
              </FormControl>
              <FormDescription>Max file size is 20 MB</FormDescription>
            </FormItem>
            <FormItem>
              <FormLabel>Please add any supplemental materials for your video like pdf workbooks, audio's etc here</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => handleFileChange(e, setSupplementalMaterial)} />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="videoKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter comma-separated keywords" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter comma-separated tags" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoCaptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Captions/Transcript If Available</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter video captions or transcript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}