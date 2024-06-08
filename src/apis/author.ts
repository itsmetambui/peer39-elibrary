import { AddAuthorPayload, authorSchema } from "@/types/author";
import { z } from "zod";

export const addAuthor = async (author: AddAuthorPayload) => {
  const response = await fetch("/api/authors", {
    method: "POST",
    body: JSON.stringify(author),
  });
  const data = await response.json();
  const newAuthor = authorSchema.parse(data);
  return newAuthor;
};

export const getAuthors = async () => {
  const response = await fetch("/api/authors");
  const data = await response.json();
  const authors = z.object({ data: z.array(authorSchema) }).parse(data);
  return authors;
};

export const deleteAuthor = async (id: string) => {
  return await fetch(`/api/authors/${id}`, {
    method: "DELETE",
  });
};
