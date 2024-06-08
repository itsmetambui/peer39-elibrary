import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peer39 - eLibrary - Authors",
};

export default function AuthorsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container max-w-screen-2xl flex flex-col flex-1 gap-8 py-16">
      {children}
    </div>
  );
}
