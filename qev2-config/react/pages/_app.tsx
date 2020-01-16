// this is the main reason for this file. import bootstrap only once
import "bootstrap/dist/css/bootstrap.css";

import { ComponentType, ComponentProps } from "react";

export default <Page extends ComponentType<any>>({
  Component,
  pageProps
}: {
  Component: Page;
  pageProps: ComponentProps<Page>;
}) => <Component {...pageProps} />;
