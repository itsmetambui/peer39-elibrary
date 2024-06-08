"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAuthor } from "@/apis/author";
import { redirect } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import { AddAuthorPayload, addAuthorSchema } from "@/types/author";

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
  });

  const form = useForm<AddAuthorPayload>({
    resolver: zodResolver(addAuthorSchema),
    defaultValues: {
      fullName: "",
    },
  });

  function onSubmit(values: AddAuthorPayload) {
    mutation.mutate(values);
  }

  if (mutation.isSuccess) {
    return redirect("/authors");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="fullName">Full name</FormLabel>
              <FormControl>
                <Input id="fullName" placeholder="Full name" {...field} />
              </FormControl>
              <FormDescription>
                This is the full name of the author.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          Submit
          {mutation.isPending && <LoaderIcon className="ml-2 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};

AddAuthorForm.displayName = "AddAuthorForm";

export { AddAuthorForm };
