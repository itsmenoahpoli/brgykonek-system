import fs from "fs";
import path from "path";

const uploadsDir = path.resolve(process.cwd(), "uploads");

export function getFile(filename: string): Buffer | null {
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return null;
}

export function deleteFile(filename: string): boolean {
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

export function listFiles(): string[] {
  if (fs.existsSync(uploadsDir)) {
    return fs.readdirSync(uploadsDir);
  }
  return [];
}
