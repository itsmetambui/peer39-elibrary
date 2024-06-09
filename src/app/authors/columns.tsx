"use client";

import { Author } from "@/types/author";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAuthor } from "@/apis/author";

export const columns: ColumnDef<Author>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fullName",
    header: "Full name",
  },
  {
    accessorKey: "numberOfBooks",
    header: "Number of books",
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const queryClient = useQueryClient();
      const mutation = useMutation({
        mutationFn: deleteAuthor,
        onSuccess: async () => {
          toast({
            variant: "success",
            description: "Author deleted successfully.",
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
      const author = row.original;

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
                <Link href={`/authors/edit/${author.id}`}>
                  <Pencil className="h-3 w-3" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit author</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Delete author"
                variant="link"
                className="p-0 m-0"
                onClick={() => {
                  toast({
                    title: "Confirm delete.",
                    description: "Are you sure you want to delete this author?",
                    action: (
                      <ToastAction
                        onClick={() => mutation.mutate(author.id)}
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
              <p>Delete author</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
