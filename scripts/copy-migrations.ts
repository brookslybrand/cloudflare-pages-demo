import { join, dirname, basename } from "path";
import {
  readdirSync,
  existsSync,
  mkdirSync,
  createReadStream,
  createWriteStream,
} from "fs";
import { createInterface } from "readline";

const prismaMigrationsPath = join(__dirname, "../", "prisma/migrations");
const d1MigrationsPath = join(__dirname, "../", "migrations");

async function copyMigrations() {
  // make sure the directory exists
  if (!existsSync(d1MigrationsPath)) {
    mkdirSync(d1MigrationsPath);
  }

  return copyMigrationFilesInDirectory(prismaMigrationsPath);
}

// TODO: remove, just for testing purposes
copyMigrations()
  .then(() => {
    console.log("Migration files successfully copied");
  })
  .catch((e) => {
    console.error(e);
    throw new Error("Migration copy failed");
  });

const pragmaRegExp = /^pragma/i;
const noPragmaReason =
  "D1 currently doesn't allow the use of most PRAGMA statements: https://developers.cloudflare.com/d1/platform/client-api/#pragma-statements";

/**
 * Copy the file line by line, commenting out all PRAGMA statements
 */
async function copyMigrationFile(sourceFilePath: string) {
  const prismaDirectoryName = basename(dirname(sourceFilePath));
  const destinationFilePath = join(
    d1MigrationsPath,
    `${prismaDirectoryName}.sql`
  );

  const sourceStream = createReadStream(sourceFilePath);
  const destinationStream = createWriteStream(destinationFilePath);

  const rl = createInterface({ input: sourceStream, crlfDelay: Infinity });

  for await (let line of rl) {
    if (pragmaRegExp.test(line)) {
      line = `-- ${line} /* ${noPragmaReason} */`;
    }
    destinationStream.write(line + "\n");
  }

  sourceStream.close();
  destinationStream.close();
}

async function copyMigrationFilesInDirectory(directoryPath: string) {
  let promises: Promise<void>[] = [];
  for (let dirent of readdirSync(directoryPath, { withFileTypes: true })) {
    const direntPath = join(directoryPath, dirent.name);
    // Recursively call this function on all files/directories in the directory
    if (dirent.isDirectory()) {
      promises.push(copyMigrationFilesInDirectory(direntPath));
      continue;
    }

    // Copy all sql files
    if (direntPath.endsWith(".sql")) {
      promises.push(copyMigrationFile(direntPath));
    }
  }

  // Squash all promises into a single promise
  await Promise.all(promises);
}
