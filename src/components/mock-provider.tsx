"use client";
import { useEffect, useState } from "react";

export function MockProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mockingEnabled, enableMocking] = useState(false);

  useEffect(() => {
    async function enableApiMocking() {
      if (
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
      ) {
        const { worker } = await import("../mocks/browser");
        await worker.start({ onUnhandledRequest: "bypass" });
      }
      enableMocking(true);
    }

    enableApiMocking();
  }, []);

  if (!mockingEnabled) {
    return null;
  }

  return <>{children}</>;
}
