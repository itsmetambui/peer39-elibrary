import { z } from "zod";

const authorSchema = z.array(
  z.object({
    id: z.string(),
    fullName: z.string(),
  })
);

const publishedYearSchema = z.coerce
  .number()
  .int()
  .positive()
  .max(new Date().getFullYear(), {
    message: "Published year must be less than or equal to the current year.",
  });

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: authorSchema,
  publishedYear: publishedYearSchema,
});

export type Book = z.infer<typeof bookSchema>;

export const addBookSchema = z.object({
  title: z.string().min(1, {
    message: "Username must be at least 1 characters.",
  }),
  publishedYear: publishedYearSchema,
  authors: z.array(z.string()).min(1, {
    message: "At least one author is required.",
  }),
});

export type AddBookPayload = z.infer<typeof addBookSchema>;
