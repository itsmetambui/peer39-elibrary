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
import { AuthorPicker } from "@/app/authors/add/author-picker";
import { MutateBookPayload, addBookSchema } from "@/types/books";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";

const BookForm = ({
  onSubmit,
  defaultValues,
  disabled = false,
}: {
  onSubmit: (values: MutateBookPayload) => void;
  defaultValues: MutateBookPayload;
  disabled?: boolean;
}) => {
  const form = useForm<MutateBookPayload>({
    resolver: zodResolver(addBookSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form.formState.isDirty]);

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
                <Input
                  id="title"
                  placeholder="Title"
                  disabled={disabled}
                  autoComplete="off"
                  {...field}
                />
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
                  disabled={disabled}
                  autoComplete="off"
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
                <AuthorPicker
                  id="authors"
                  disabled={disabled}
                  autoComplete="off"
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

        <Button type="submit" disabled={disabled}>
          Submit
          {disabled && <LoaderIcon className="ml-2 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};
BookForm.displayName = "BookForm";

export { BookForm };
