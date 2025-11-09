"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

export default function TanStackProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
