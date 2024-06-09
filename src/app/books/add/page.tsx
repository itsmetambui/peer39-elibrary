import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { AddBookForm } from "./add-book-form";
export default function AddBookPage() {
  return (
    <div className="space-y-4">
      <div className="h-10 flex items-center justify-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link href="/books">Books</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="rounded-lg border shadow-sm px-4 py-8 space-y-8">
        <p className="text-xl font-semibold">Add new book</p>
        <AddBookForm />
      </div>
    </div>
  );
}
