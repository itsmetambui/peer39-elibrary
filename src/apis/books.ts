import { z } from "zod";

import { bookSchema, MutateBookPayload } from "@/types/books";

export const addBook = async (book: MutateBookPayload) => {
  const response = await fetch("/api/books", {
    method: "POST",
    body: JSON.stringify(book),
  });
  const data = await response.json();
  const newBook = bookSchema.parse(data);
  return newBook;
};

export const getBooks = async (authorId?: string) => {
  const url = authorId
    ? `/api/books?${new URLSearchParams({ authorId })}`
    : "/api/books";

  const response = await fetch(url);
  const data = await response.json();
  const books = z.array(bookSchema).parse(data);
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
