"use client";

import { Author } from "@/types/author";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    cell: ({ row }) => {
      const author = row.original;
      return (
        <div className="float-right space-x-2 flex gap-2">
          <Button variant="link" asChild className="p-0 m-0">
            <Link href={`/authors/edit/${author.id}`}>
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
