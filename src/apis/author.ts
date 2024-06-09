import { z } from "zod";

import { authorSchema, MutateAuthorPayload } from "@/types/author";

export const addAuthor = async (author: MutateAuthorPayload) => {
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
  const authors = z.array(authorSchema).parse(data);
  return authors;
};

export const getAuthor = async (id: string) => {
  const response = await fetch(`/api/authors/${id}`);
  const data = await response.json();
  const author = authorSchema.parse(data);
  return author;
};

export const updateAuthor = async (id: string, author: MutateAuthorPayload) => {
  const response = await fetch(`/api/authors/${id}`, {
    method: "PUT",
    body: JSON.stringify(author),
  });
  const data = await response.json();
  const updatedAuthor = authorSchema.parse(data);
  return updatedAuthor;
};

export const deleteAuthor = async (id: string) => {
  return await fetch(`/api/authors/${id}`, {
    method: "DELETE",
  });
};
