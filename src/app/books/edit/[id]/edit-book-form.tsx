"use client";

import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
import { getBook, updateBook } from "@/apis/books";
import { BookForm } from "../../book-form";
import { MutateBookPayload } from "@/types/books";

const EditBookForm = () => {
  const queryClient = useQueryClient();
  const params = useParams();

  const bookId = params.id as string;
  const {
    isPending,
    data: book = {
      title: "",
      publishedYear: 2024,
      authors: [],
    },
  } = useQuery({
    queryKey: ["books", bookId],
    queryFn: () => getBook(bookId),
    enabled: !!bookId,
  });

  const formDefaultValues = {
    title: book.title,
    publishedYear: book.publishedYear,
    authors: book.authors.map((author) => author.id),
  };

  const mutation = useMutation({
    mutationFn: (book: MutateBookPayload) => updateBook(bookId, book),
    onSuccess: async () => {
      toast({
        variant: "success",
        description: "Book updated successfully.",
      });
      return await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authors"] }),
        queryClient.invalidateQueries({ queryKey: ["books"] }),
      ]);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const pending = isPending || mutation.isPending;

  if (mutation.isSuccess) {
    return redirect("/books");
  }

  return (
    <BookForm
      key={bookId}
      onSubmit={mutation.mutate}
      defaultValues={formDefaultValues}
      disabled={pending}
    />
  );
};
EditBookForm.displayName = "EditBookForm";

export { EditBookForm };
