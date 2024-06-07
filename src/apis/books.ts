import { AddBookPayload, bookSchema } from "@/types/books";
import { z } from "zod";

export const addBook = async (book: AddBookPayload) => {
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
