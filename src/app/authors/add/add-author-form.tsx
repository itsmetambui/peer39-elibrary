"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { addAuthor } from "@/apis/author";
import { toast } from "@/components/ui/use-toast";

import { AuthorForm } from "../author-form";

const AddAuthorForm = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addAuthor,
    onSuccess: async () => {
      toast({
        variant: "success",
        description: "Author added successfully.",
      });
      return await queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  if (mutation.isSuccess) {
    return redirect("/authors");
  }

  return (
    <AuthorForm
      onSubmit={mutation.mutate}
      defaultValues={{
        fullName: "",
      }}
      disabled={mutation.isPending}
    />
  );
};

AddAuthorForm.displayName = "AddAuthorForm";

export { AddAuthorForm };
