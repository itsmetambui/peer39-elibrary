import Link from "next/link";
import { AddAuthorForm } from "./add-author-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
export default function AddAuthorPage() {
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
              <BreadcrumbPage>Add</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="rounded-lg border shadow-sm px-4 py-8 space-y-8">
        <p className="text-xl font-semibold">Add new author</p>
        <AddAuthorForm />
      </div>
    </div>
  );
}
