"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";
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
import { MutateAuthorPayload, mutateAuthorSchema } from "@/types/author";

type AuthorFormProps = {
  onSubmit: (values: MutateAuthorPayload) => void;
  defaultValues: MutateAuthorPayload;
  disabled?: boolean;
};

const AuthorForm = ({
  onSubmit,
  defaultValues,
  disabled = false,
}: AuthorFormProps) => {
  const form = useForm<MutateAuthorPayload>({
    resolver: zodResolver(mutateAuthorSchema),
    defaultValues,
  });
  const {
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (!isDirty) {
      reset(defaultValues);
    }
  }, [defaultValues, isDirty, reset]);

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
                <Input
                  id="fullName"
                  placeholder="Full name"
                  disabled={disabled}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the full name of the author.
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

AuthorForm.displayName = "AuthorForm";

export { AuthorForm };
