import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import "@/styles/globals.css";
import dynamic from "next/dynamic";
import type { AppProps } from "next/app";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
