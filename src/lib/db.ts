import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export async function readData<T>(fileName: string): Promise<T> {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    throw new Error(`Failed to read data from ${fileName}`);
  }
}

export async function writeData<T>(fileName: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing to ${fileName}:`, error);
    throw new Error(`Failed to write data to ${fileName}`);
  }
}
