import { MutateBookPayload, bookSchema } from "@/types/books";
import { z } from "zod";

export const addBook = async (book: MutateBookPayload) => {
  const response = await fetch("/api/books", {
    method: "POST",
    body: JSON.stringify(book),
  });
  const data = await response.json();
  const newBook = bookSchema.parse(data);
  return newBook;
};

export const getBooks = async () => {
  const response = await fetch("/api/books");
  const data = await response.json();
  const books = z.object({ data: z.array(bookSchema) }).parse(data);
  return books;
};

export const getBook = async (id: string) => {
  const response = await fetch(`/api/books/${id}`);
  const data = await response.json();
  const book = bookSchema.parse(data);
  return book;
};

export const updateBook = async (id: string, book: MutateBookPayload) => {
  const response = await fetch(`/api/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(book),
  });
  const data = await response.json();
  const updatedBook = bookSchema.parse(data);
  return updatedBook;
};

export const deleteBook = async (id: string) => {
  return await fetch(`/api/books/${id}`, {
    method: "DELETE",
  });
};
