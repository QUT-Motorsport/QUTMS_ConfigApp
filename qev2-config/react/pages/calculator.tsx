import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container } from "reactstrap";
import { post } from "../api";

export default ({ _ans: [ans, setAns] = useState("") }) => (
  <>
    <Head>
      <title>Calculator - Nextron (with-typescript-python-api)</title>
    </Head>

    <div>
      <style jsx>{`
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

      <Container>
        <h2>Calculator</h2>
        <ol>
          <li>
            <Link href="/index">
              <a>Home</a>
            </Link>
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
          onKeyDown={event => {
            if (event.key === "Enter") {
              post("calc", {
                math: event.currentTarget.value
              }).then(({ calc }: { calc: string }) => setAns(calc));
            }
          }}
        />
        <div>{ans}</div>
      </Container>
    </div>
  </>
);
