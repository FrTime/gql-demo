import React from "react";
import {
  ApolloClient,
  split,
  InMemoryCache,
  HttpLink,
} from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";

function ApolloClientProvider({ children, token }) {
  function getHeaders() {
    const headers = {};
    if (token) {
      console.log("JWT generated:", token);
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  const httpLink = new HttpLink({
    uri: "http://gql.localhost:8888/v1/graphql",
    fetch: (uri, options) => {
      options.headers = getHeaders();
      return fetch(uri, options);
    },
  });

  const wsLink = new WebSocketLink({
    uri: "ws://gql.localhost:8888/v1/graphql",
    options: {
      reconnect: true,
      lazy: true,
      timeout: 30000,
      inactivityTimeout: 30000,
      connectionParams: () => {
        return { headers: getHeaders() };
      },
    },
  });

  const errorLink = onError((error) => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  });

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(httpLink),
    link: errorLink.concat(
      split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    ),
  });

  return <ApolloProvider client={apolloClient}> {children} </ApolloProvider>;
}

export default ApolloClientProvider;
