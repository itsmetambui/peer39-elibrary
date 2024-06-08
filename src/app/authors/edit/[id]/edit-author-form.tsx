"use client";

import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
import { getAuthor, updateAuthor } from "@/apis/author";
import { MutateAuthorPayload } from "@/types/author";
import { AuthorForm } from "../../author-form";
import { ToastAction } from "@/components/ui/toast";

const EditAuthorForm = () => {
  const queryClient = useQueryClient();
  const params = useParams();

  const authorId = params.id as string;
  const {
    isPending,
    data: author = {
      fullName: "",
    },
    error,
  } = useQuery({
    queryKey: ["authors", authorId],
    queryFn: () => getAuthor(authorId),
    enabled: !!authorId,
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
    mutationFn: (author: MutateAuthorPayload) => updateAuthor(authorId, author),
    onSuccess: async () => {
      toast({
        variant: "success",
        description: "Author updated successfully.",
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
    return redirect("/authors");
  }

  return (
    <AuthorForm
      onSubmit={mutation.mutate}
      defaultValues={{
        fullName: author.fullName,
      }}
      disabled={pending}
    />
  );
};
EditAuthorForm.displayName = "EditAuthorForm";

export { EditAuthorForm };
