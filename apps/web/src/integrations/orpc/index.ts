import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { AppRouterClient } from "server/route";
import { env } from "@/config/env";

const getORPCClient = createIsomorphicFn()
  .server((): AppRouterClient => {
    const link = new RPCLink({
      url: `${env.SERVER_URL}/rpc`,
      // this must be called as a function to capture per-request headers
      // otherwise, all requests would share the same headers (first request's headers)
      // headers: getRequestHeaders(),
      headers: () => {
        return getRequestHeaders();
      },
      interceptors: [
        onError((error) => {
          console.error(error);
        }),
      ],
    });

    return createORPCClient<AppRouterClient>(link);
  })
  .client((): AppRouterClient => {
    const link = new RPCLink({
      url: `${env.VITE_API_URL}/rpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          // credentials: "include",
        });
      },
      interceptors: [
        onError((error) => {
          console.error(error);
        }),
      ],
    });

    return createORPCClient<AppRouterClient>(link);
  });

const client: AppRouterClient = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
