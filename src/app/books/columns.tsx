"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book } from "@/types/books";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "@/apis/books";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    id: "authors",
    header: "Authors",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="flex flex-wrap gap-2">
          {book.authors.map((author) => (
            <Badge key={author.id} variant="secondary">
              {author.fullName}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "publishedYear",
    header: "Publication Year",
  },

  {
    id: "actions",
    cell: function Cell({ row }) {
      const queryClient = useQueryClient();
      const mutation = useMutation({
        mutationFn: deleteBook,
        onSuccess: async () => {
          toast({
            variant: "success",
            description: "Book deleted successfully.",
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
      const book = row.original;

      return (
        <div className="float-right space-x-2 flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Edit book"
                variant="link"
                asChild
                className="p-0 m-0"
              >
                <Link href={`/books/edit/${book.id}`}>
                  <Pencil className="h-3 w-3" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit book</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Delete book"
                variant="link"
                className="p-0 m-0"
                onClick={() => {
                  toast({
                    title: "Confirm delete.",
                    description: "Are you sure you want to delete this book?",
                    action: (
                      <ToastAction
                        onClick={() => mutation.mutate(book.id)}
                        altText="Try again"
                      >
                        Confirm
                      </ToastAction>
                    ),
                  });
                }}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete book</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
