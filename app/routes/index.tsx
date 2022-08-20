import type { HeadersFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import randomWords from "random-words";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=30, s-maxage=600",
  };
};

export async function loader() {
  await new Promise((res) => setTimeout(res, 2000));

  const [word] = randomWords(1);

  return json(
    { word },
    {
      headers: {
        // max-age controls the browser cache
        // s-maxage controls a CDN cache
        "Cache-Control": "public, max-age=30, s-maxage=86400",
      },
    }
  );
}

export default function Index() {
  const { word } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <Link to="/test">Go to test</Link>
      <h2>The word was: {word}</h2>
    </div>
  );
}
