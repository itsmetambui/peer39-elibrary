"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href="/books"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/books" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Books
          </Link>
          <Link
            href="/authors"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/authors" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Authors
          </Link>
        </nav>
      </div>
    </header>
  );
};
Header.displayName = "Header";

export { Header };
