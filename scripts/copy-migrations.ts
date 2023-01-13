import { join, dirname, basename } from "path";
import { readdirSync, existsSync, mkdirSync } from "fs";
import { copyFile } from "fs/promises";

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

function copyMigrationFile(sourceFilePath: string) {
  const prismaDirectoryName = basename(dirname(sourceFilePath));
  const destinationFilePath = join(
    d1MigrationsPath,
    `${prismaDirectoryName}.sql`
  );

  return copyFile(sourceFilePath, destinationFilePath);
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
