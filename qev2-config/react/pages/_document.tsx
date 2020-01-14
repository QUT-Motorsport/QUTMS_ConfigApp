//
// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file
//
import Document, {
  Head,
  Main,
  NextScript,
  DocumentContext
} from "next/document";

export default class MyDocument extends Document {
  public static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  public render() {
    return (
      <html>
        <Head>
          <meta content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex, follow" />
          <link
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
            rel="stylesheet"
            integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
            integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
            crossOrigin="anonymous"
          />
          <style>{css}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            src="https://code.jquery.com/jquery-2.2.4.min.js"
            integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
            crossOrigin="anonymous"
          />
          <script
            src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
            crossOrigin="anonymous"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof(require) === "undefined") {
                  window.isInElectronRenderer = false;
                } else {
                  window.isInElectronRenderer = true;
                  window.nodeRequire = require;
                  delete window.exports;
                  delete window.module;
                }
              `
            }}
          />
        </body>
      </html>
    );
  }
}

const css = `
body {
  position: relative;
  color: white;
  height: 100vh;
  background-color: #232C39;
  background-image: linear-gradient(45deg, rgba(0, 216, 255, .5) 10%, rgba(0, 1, 127, .7));
  font-family: Arial, Helvetica, Helvetica Neue, serif;
}

h2 {
  margin: 0;
  font-size: 2.25rem;
  font-weight: bold;
  letter-spacing: -.025em;
  color: #fff;
}

p {
  font-size: 24px;
}

li {
  list-style: none;
}

a {
  color: white;
  opacity: .75;
  text-decoration: none;
}

a:hover {
  color: coral;
  opacity: 1;
  text-decoration: none;
  cursor: pointer;
}
`;
