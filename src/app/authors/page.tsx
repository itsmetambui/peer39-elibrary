"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { getAuthors } from "@/apis/author";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { MswError } from "@/components/msw-error";

export default function AuthorsPage() {
  const {
    data: authors = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  if (isError) {
    return <MswError />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 h-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Authors</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button asChild>
          <Link href="/authors/add">+ Add</Link>
        </Button>
      </div>
      {isPending ? <Loading /> : <DataTable data={authors} columns={columns} />}
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
