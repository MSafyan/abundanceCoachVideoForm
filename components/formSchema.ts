import { z } from "zod";

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
  categoryIds: z.string({
    required_error: "Category is required.",
  }),
  title: z.string().min(5, {
    message: "Video title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Video description must be at least 10 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  keywords: z.array(z.string()),
  tagNames: z.array(z.string()),
  transcript: z.string(),
  thumbnail: z.string().optional(),
  supplementalMaterialUrl: z.string().optional(),
  unlockCriteria: z.enum(["public", "accountabilityPartner", "amtPoints"]),
  amtPointsRequired: z.number().optional(),
});

export { formSchema };
