"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";

import { getBooks } from "@/apis/books";
import { MswError } from "@/components/msw-error";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { AuthorPicker } from "./author-picker";
import { columns } from "./columns";

export default function BooksPage() {
  const searchParams = useSearchParams();
  const authorId = searchParams.get("author") || undefined;

  const {
    data: books = [],
    isError,
    isPending,
  } = useQuery({
    queryKey: ["books", [authorId]],
    queryFn: () => getBooks(authorId),
  });

  if (isError) {
    return <MswError />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 min-h-10 flex-wrap">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Books</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-2">
          <AuthorPicker />
          <Button asChild>
            <Link href="/books/add">+ Add</Link>
          </Button>
        </div>
      </div>
      {isPending ? <Loading /> : <DataTable data={books} columns={columns} />}
    </div>
  );
}

const Loading = () => (
  <div className="rounded-md border grid grid-cols-12 gap-4 p-4">
    <Skeleton className="h-8 col-span-3" />
    <Skeleton className="h-8 col-span-8" />
    <Skeleton className="h-8 col-span-1" />
    {Array.from(Array(5).keys()).map((index) => (
      <Fragment key={index}>
        <Skeleton className="h-[56px] col-span-3" />
        <Skeleton className="h-[56px] col-span-8" />
        <Skeleton className="h-[56px] col-span-1" />
      </Fragment>
    ))}
  </div>
);
