import { z } from "zod";

export const authorSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  numberOfBooks: z.number().optional(),
});

export type Author = z.infer<typeof authorSchema>;

export const mutateAuthorSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full name must be at least 1 characters.",
  }),
});

export type MutateAuthorPayload = z.infer<typeof mutateAuthorSchema>;
