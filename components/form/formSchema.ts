import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  categoryIds: z
    .string({
      required_error: "Please select a category.",
    })
    .min(1, {
      message: "Please select a category.",
    }),
  title: z.string().min(5, {
    message: "Video title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Video description must be at least 10 characters.",
  }),
  videoHostedOn: z.enum(["vimeoWesion", "vimeoPersonal", "youtube", "others"]),
  url: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional(),
  keywords: z.array(z.string()),
  tagNames: z.array(z.string()),
  transcript: z.string(),
  thumbnail: z.string().optional(),
  supplementalMaterialUrl: z.string().optional(),
  unlockCriteria: z
    .array(z.enum(["public", "accountabilityPartner", "amtPoints"]))
    .min(1, { message: "At least one unlock criteria must be selected" }),
});

export { formSchema };
