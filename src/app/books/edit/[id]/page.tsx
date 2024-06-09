import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { EditBookForm } from "./edit-book-form";
export default function EditBookPage({ params }: { params: { id: string } }) {
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
              <BreadcrumbPage>Edit {params.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="rounded-lg border shadow-sm px-4 py-8 space-y-8">
        <p className="text-xl font-semibold">Edit book</p>
        <EditBookForm />
      </div>
    </div>
  );
}
