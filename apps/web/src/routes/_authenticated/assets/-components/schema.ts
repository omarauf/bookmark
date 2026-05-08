import z from "zod";

export const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  bio: z.string().min(1, "Bio is required"),
  age: z.number().min(0).max(120),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().min(1, "Role is required"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  gender: z.string().min(1, "Gender is required"),
  subscribe: z.boolean(),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  plan: z.string().min(1, "Plan is required"),
  startDate: z.date().optional(),
  availability: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional(),
  budget: z.tuple([z.number(), z.number()]),
  viewMode: z.string().min(1, "View mode is required"),
  notifications: z.boolean(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  avatar: z.instanceof(File).optional(),
  document: z.instanceof(File).optional(),
  favoriteColor: z.string().min(1, "Color is required"),
  experienceLevel: z.array(z.string()).min(1, "Select at least one level"),
});

export type FormValues = z.infer<typeof formSchema>;

export const defaultValues: FormValues = {
  fullName: "",
  bio: "",
  age: 0,
  password: "",
  role: "",
  interests: [],
  gender: "",
  subscribe: false,
  skills: [],
  plan: "",
  startDate: undefined,
  availability: undefined,
  budget: [0, 100],
  viewMode: "",
  notifications: false,
  tags: [],
  categories: [],
  avatar: undefined,
  document: undefined,
  favoriteColor: "#3b82f6",
  experienceLevel: [],
};
