"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Author } from "@/types/author";
import { useQuery } from "@tanstack/react-query";
import { getAuthors } from "@/apis/author";
import { Command as CommandPrimitive } from "cmdk";
import { useRouter, useSearchParams } from "next/navigation";
import { createUrl } from "@/lib/utils";

const AuthorPicker = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const applySearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (selectedAuthor) {
      newParams.set("author", selectedAuthor.id);
    } else {
      newParams.delete("author");
    }
    router.push(createUrl("/books", newParams));
  };

  if (isDesktop) {
    return (
      <div className="space-x-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start">
              {selectedAuthor ? (
                <>{selectedAuthor.fullName}</>
              ) : (
                <>Select author</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <AuthorList
              setOpen={setOpen}
              setSelectedAuthor={setSelectedAuthor}
            />
          </PopoverContent>
        </Popover>
        <Button
          disabled={!selectedAuthor}
          onClick={applySearch}
          variant="outline"
        >
          Apply
        </Button>
      </div>
    );
  }

  return (
    <div className="space-x-2">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedAuthor ? (
              <>{selectedAuthor.fullName}</>
            ) : (
              <>Select author</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <AuthorList
              setOpen={setOpen}
              setSelectedAuthor={setSelectedAuthor}
            />
          </div>
        </DrawerContent>
      </Drawer>
      <Button
        disabled={!selectedAuthor}
        onClick={applySearch}
        variant="outline"
      >
        Apply
      </Button>
    </div>
  );
};

const AuthorList = ({
  setOpen,
  setSelectedAuthor,
}: {
  setOpen: (open: boolean) => void;
  setSelectedAuthor: (author: Author | null) => void;
}) => {
  const [search, setSearch] = useState("");
  const {
    data: authors = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  const filteredAuthors = authors.filter((author) =>
    author.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Command shouldFilter={false}>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        autoFocus={true}
        placeholder="Filter author..."
      />
      <CommandList>
        {error && (
          <p className="text-center py-6 text-sm">
            Something went wrong. Please try again.
          </p>
        )}
        {isPending && (
          <CommandPrimitive.Loading className="text-center py-6 text-sm">
            Loading authors...
          </CommandPrimitive.Loading>
        )}
        {!isPending && filteredAuthors.length === 0 && !error && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        <CommandGroup>
          {filteredAuthors.map((author) => (
            <CommandItem
              key={author.id}
              value={author.id}
              onSelect={(value) => {
                setSelectedAuthor(
                  authors.find((author) => author.id === value) || null
                );
                setOpen(false);
              }}
              className="cursor-pointer"
            >
              {author.fullName}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

AuthorPicker.displayName = "AuthorPicker";

export { AuthorPicker };
