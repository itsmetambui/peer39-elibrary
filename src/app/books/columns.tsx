"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book } from "@/types/books";
import { Badge } from "@/components/ui/badge";

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
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="float-right space-x-2 flex gap-2">
          <Button variant="link" asChild className="p-0 m-0">
            <Link href={`/books/edit/${book.id}`}>
              <Pencil className="h-3 w-3" />
            </Link>
          </Button>
          <Button variant="link" className="p-0 m-0">
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
];
