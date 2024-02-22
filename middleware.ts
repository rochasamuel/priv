import {
	NextAuthMiddlewareOptions,
	NextRequestWithAuth,
	withAuth,
} from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = (request: NextRequestWithAuth) => {
	const isPrivateRoutes = !request.nextUrl.pathname.startsWith("/auth|/public");

	if (isPrivateRoutes && !request.nextauth.token) {
		return NextResponse.rewrite(new URL("/auth/login", request.url));
	}
};

const callbackOptions: NextAuthMiddlewareOptions = {};

export default withAuth(middleware, callbackOptions);

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth|public/*).*)"],
};
