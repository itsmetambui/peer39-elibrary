"use client";

import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { addBook } from "@/apis/books";
import { BookForm } from "../book-form";

const AddBookForm = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addBook,
    onSuccess: async () => {
      toast({
        variant: "success",
        description: "Book added successfully.",
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

  if (mutation.isSuccess) {
    return redirect("/books");
  }

  return (
    <BookForm
      onSubmit={mutation.mutate}
      defaultValues={{
        title: "",
        publishedYear: 2024,
        authors: [],
      }}
      disabled={mutation.isPending}
    />
  );
};
AddBookForm.displayName = "AddBookForm";

export { AddBookForm };
