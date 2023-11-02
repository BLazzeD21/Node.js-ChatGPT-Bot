import { unlink } from 'fs/promises';

export async function deleteFile(path) {
  try {
    await unlink(path);
  } catch (error) {
    console.log(error.message);
  }
}
