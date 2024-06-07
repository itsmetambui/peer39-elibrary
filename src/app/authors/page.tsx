"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

export default function AuthorsPage() {
  const { data: response, status } = useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  if (status === "error") {
    return <Error />;
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
          <Link href="/authors/add">Add Author</Link>
        </Button>
      </div>
      {status === "success" ? (
        <DataTable data={response.data} columns={columns} />
      ) : (
        <Loading />
      )}
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

const Error = () => {
  const queryClient = useQueryClient();

  const retry = () => {
    queryClient.fetchQuery({ queryKey: ["authors"] });
  };

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-2xl font-bold tracking-tight">
          Something went wrong please try again
        </p>
        <Button className="mt-4" variant="secondary" onClick={retry}>
          Try again
        </Button>
      </div>
    </div>
  );
};
