import type { HeadersFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "max-age=300, s-maxage=600",
  };
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix, yo</h1>
      <Link to="/test">Go to test</Link>
    </div>
  );
}
