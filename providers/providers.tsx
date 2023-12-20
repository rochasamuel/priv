"use client";

import AuthSessionProvider from "@/providers/session-provider";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

function Providers({ children }: React.PropsWithChildren) {
	const [client] = React.useState(new QueryClient());

	return (
		<QueryClientProvider client={client}>
			<AuthSessionProvider>{children}</AuthSessionProvider>
		</QueryClientProvider>
	);
}

export default Providers;
