"use client";

import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
import { getBook, updateBook } from "@/apis/books";
import { BookForm } from "../../book-form";
import { MutateBookPayload } from "@/types/books";
import { ToastAction } from "@/components/ui/toast";

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
    error,
  } = useQuery({
    queryKey: ["books", bookId],
    queryFn: () => getBook(bookId),
    enabled: !!bookId,
  });

  if (error) {
    toast({
      variant: "destructive",
      description: "Something went wrong. Please try again.",
      action: (
        <ToastAction onClick={() => window.location.reload()} altText="Refresh">
          Refresh
        </ToastAction>
      ),
    });
  }

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
    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
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
      defaultValues={{
        title: book.title,
        publishedYear: book.publishedYear,
        authors: book.authors.map((author) => author.id),
      }}
      disabled={pending}
    />
  );
};
EditBookForm.displayName = "EditBookForm";

export { EditBookForm };
