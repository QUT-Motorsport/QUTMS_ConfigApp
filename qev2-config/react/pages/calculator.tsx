import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import gql from "graphql-tag";
import { getAppGlobalClient } from "./_app";

export default ({ _ans: [ans, setAns] = useState(NaN) }) => (
  <>
    <Head>
      <title>Calculator - Nextron (with-typescript-python-api)</title>
    </Head>

    <div>
      <style>{`
          .container {
            position: absolute;
            top: 30%;
            left: 10px;
          }
        
          .container h2 {
            font-size: 5rem;
          }
        
          .container a {
            font-size: 1.4rem;
          }
        
          .container ol {
            padding-left: 20px;
          }
        `}</style>
      <div className="container">
        <h2>Calculator</h2>
        <ol>
          <li>
            <Link href="/home">Home</Link>
          </li>
        </ol>
        <h1>Hello Calculator!</h1>
        <p>
          Input something like <code>1 + 1</code>.
        </p>
        <p>
          This calculator supports <code>+-*/^()</code>, whitespaces, and
          integers and floating numbers.
        </p>
        <input
          style={{ color: "black" }}
          onKeyDown={event =>
            event.key === "Enter"
              ? getAppGlobalClient()!
                  .query({
                    query: gql`
                      query calc($math: String!) {
                        calc(math: $math)
                      }
                    `,
                    variables: {
                      math: event.currentTarget.value
                    }
                  })
                  .then(({ data }) => setAns(data.calc))
              : null
          }
        />
        <div>{ans}</div>
      </div>
    </div>
  </>
);
