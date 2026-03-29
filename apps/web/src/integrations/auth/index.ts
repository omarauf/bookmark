import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { Auth } from "server/auth";
import { serverUrl } from "@/lib/server-url";

export const authClient = createAuthClient({
  baseURL: serverUrl(),
  plugins: [inferAdditionalFields<Auth>()],
});

const getSession = createIsomorphicFn()
  .server(async () => {
    const headers = getRequestHeaders();
    const { data } = await authClient.getSession({ fetchOptions: { headers } });
    if (data === null) return null;
    return data;
  })
  .client(async () => {
    const { data } = await authClient.getSession();
    if (data === null) return null;
    return data;
  });

export const authQueries = {
  all: ["auth"],
  session: () =>
    queryOptions({
      queryKey: [...authQueries.all, "session"],
      queryFn: () => getSession(),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
};

export const useAuthentication = () => {
  // const { data: userSession } = authClient.useSession();
  const { data: userSession } = useSuspenseQuery(authQueries.session());

  return { userSession, isAuthenticated: !!userSession };
};

export const useAuthenticatedUser = () => {
  const { userSession } = useAuthentication();

  if (!userSession) {
    throw new Error("User is not authenticated!");
  }

  return userSession;
};

type AuthClientErrorCodes = typeof authClient.$ERROR_CODES;

type AuthErrorCodes = AuthClientErrorCodes;
export type AuthErrorCode = keyof AuthErrorCodes;
