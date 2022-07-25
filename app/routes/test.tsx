import type { HeadersFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "max-age=10",
  };
};

export default function Test() {
  return (
    <div>
      <h1>The test!</h1>
      <Link to="/">Go to home</Link>
    </div>
  );
}
