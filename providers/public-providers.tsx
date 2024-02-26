"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthSessionProvider from "./session-provider";

function PublicProviders({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </QueryClientProvider>
  );
}

export default PublicProviders;
