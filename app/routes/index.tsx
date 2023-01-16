import { json } from "@remix-run/cloudflare";
import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { z } from "zod";

const Posts = z.array(
  z.object({
    id: z.number().int(),
    title: z.string().nullable(),
    published: z.coerce.boolean(),
    authorId: z.number().int(),
  })
);

function getDB(context: LoaderArgs["context"]) {
  const db = context.DB;

  invariant(
    typeof db === "object" && db !== null && "prepare" in db,
    "context.DB did not return a D1Database"
  );

  return db as D1Database;
}

export async function loader({ context }: LoaderArgs) {
  const db = getDB(context);

  const { results } = await db
    .prepare(
      `
      SELECT * from Post
      INNER JOIN User on User.id = Post.authorId
      Where User.name = ?
    `
    )
    .bind("Brooks")
    .all();

  const posts = Posts.parse(results);

  return json({ posts });
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

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
            {Object.keys(posts[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {posts?.map((post) => (
            <tr key={post.id}>
              {Object.entries(post).map(([key, value]) => (
                <td key={key}>{String(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
