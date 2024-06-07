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
import { AuthorPicker } from "@/app/authors/add/author-picker";
import { redirect } from "next/navigation";
import { AddBookPayload, addBookSchema } from "@/types/books";
import { addBook } from "@/apis/books";
import { LoaderIcon } from "lucide-react";

export function AddBookForm() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      toast({
        variant: "success",
        description: "Book added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const form = useForm<AddBookPayload>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: "",
      publishedYear: 2024,
      authors: [],
    },
  });

  function onSubmit(values: AddBookPayload) {
    mutation.mutate(values);
  }

  if (mutation.isSuccess) {
    return redirect("/books");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input id="title" placeholder="Title" {...field} />
              </FormControl>
              <FormDescription>This is the title of the book.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="publishedYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="publishedYear">Published Year</FormLabel>
              <FormControl>
                <Input
                  placeholder="Published Year"
                  type="number"
                  step={1}
                  id="publishedYear"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the published year of the book.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authors"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="authors">Authors</FormLabel>
              <FormControl>
                <AuthorPicker id="authors" {...field} />
              </FormControl>
              <FormDescription>
                This is the published year of the book.
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
}
