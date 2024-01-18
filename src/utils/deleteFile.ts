import { unlink } from "fs/promises";

export async function deleteFile(path: string) {
  try {
    await unlink(path);
  } catch (error) {
    console.log(`${error.name} deletefile: ${error.message}`);
  }
}
