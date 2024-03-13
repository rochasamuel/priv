import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import apiClient from "@/backend-sdk";
import axios from "axios";

const useBackendClient = (initialAccessToken?: string) => {
	const { data: session, update } = useSession();
	const [accessToken, setAccessToken] = useState<any>(
		session?.user.accessToken,
	);
	const [api, setApi] = useState(apiClient(session?.user.accessToken));
	const [readyToFetch, setReadyToFecth] = useState(false);

	useEffect(() => {
		if (session?.user.accessToken) {
			setApi(apiClient(session?.user.accessToken))
			setReadyToFecth(true);
		}
	}, [session]);

	// useEffect(() => {
	// 	if (accessToken) {
	// 		setApi(apiClient(accessToken));
	// 	}
	// }, [accessToken]);

	useEffect(() => {
		const interceptor = api.axiosClient.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;

				if (error.response.status === 401 && !originalRequest.sent) {
					console.log("refreshing token...")
					originalRequest.sent = true;

					try {
						const newAccessToken = await refreshAccessToken();
						originalRequest.headers.Authorization = `Bearer ${newAccessToken.access_token}`;
						// Retry the original request with the new access token
						return axios(originalRequest);
					} catch (refreshError: any) {
						console.error("Token refresh failed:", refreshError);
						if(refreshError.response.status === 400) {
							signOut();
						}
						// Optionally, handle the refresh error here
						throw error;
					}
				}

				throw error;
			},
		);

		return () => {
			axios.interceptors.response.eject(interceptor);
		};
	}, [api]);

	const refreshAccessToken = async () => {
    console.log("refreshing token...")
		const newAccessToken = await api.auth.refreshAccessToken(
			session?.user.refreshToken!,
		);
    //update session tokens on nextauth
		update({
			user: {
				accessToken: newAccessToken.access_token,
				refreshToken: newAccessToken.refresh_token,
			},
		});

		return newAccessToken;
	};

	return {
		api,
		readyToFetch,
	};
};

export default useBackendClient;
