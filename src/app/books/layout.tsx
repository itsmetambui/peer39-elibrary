import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peer39 - eLibrary - Books",
};

export default function BooksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container max-w-screen-2xl flex flex-col flex-1 gap-8 py-8 xl:py-16">
      {children}
    </div>
  );
}
