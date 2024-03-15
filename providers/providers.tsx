"use client";

import AuthSessionProvider from "@/providers/session-provider";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { WebSocketProvider } from "./web-socket-provider";

function Providers({ children }: React.PropsWithChildren) {
	const [client] = React.useState(new QueryClient());

	return (
		<QueryClientProvider client={client}>
			<AuthSessionProvider>
				<WebSocketProvider>
					{children}
				</WebSocketProvider>
			</AuthSessionProvider>
		</QueryClientProvider>
	);
}

export default Providers;
