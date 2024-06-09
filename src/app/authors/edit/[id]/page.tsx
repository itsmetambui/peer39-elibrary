import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { EditAuthorForm } from "./edit-author-form";
export default function EditAuthorPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div className="h-10 flex items-center justify-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link href="/authors">Authors</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit {params.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="rounded-lg border shadow-sm px-4 py-8 space-y-8">
        <p className="text-xl font-semibold">Edit author</p>
        <EditAuthorForm />
      </div>
    </div>
  );
}
