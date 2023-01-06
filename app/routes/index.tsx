// @ts-nocheck TODO: add validation

import { json } from "@remix-run/cloudflare";
import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader({ context }: LoaderArgs) {
  const db = context.DB as D1Database;

  const { results } = await db
    .prepare("SELECT * FROM Customers WHERE CompanyName = ?")
    .bind("Bs Beverages")
    .all();

  return json({ results });
}

export default function Index() {
  const { results } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>
        Remix +{" "}
        <a
          href="https://developers.cloudflare.com/d1/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Cloudflare D1!
        </a>
      </h1>
      <table>
        <thead>
          <tr>
            {Object.keys(results[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {results?.map((result) => (
            <tr key={result.CustomerID}>
              {Object.values(result).map((value) => (
                <td key={value}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
