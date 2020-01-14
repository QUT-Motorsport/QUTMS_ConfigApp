import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import electron from "electron";
import fetch from "isomorphic-fetch";
import { ComponentType, ComponentProps } from "react";

let pyPort = 5000; // Actual port will be provided by main process
let appGlobalClient: ApolloClient<NormalizedCacheObject> | null = null;

const getAppGlobalClient = () => {
  return appGlobalClient;
};

if (electron && electron.ipcRenderer) {
  electron.ipcRenderer.on("pythonPort", ({}, arg) => {
    pyPort = arg;
    appGlobalClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        fetch,
        uri: "http://127.0.0.1:" + pyPort + "/graphql/"
      })
    });
  });
  electron.ipcRenderer.send("getPythonPort");
}

export { getAppGlobalClient };

export default <Page extends ComponentType<any>>({
  Component,
  pageProps
}: {
  Component: Page;
  pageProps: ComponentProps<Page>;
}) => <Component {...pageProps} />;
