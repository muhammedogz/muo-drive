import "server-only";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "/src/store/folders.json");

export interface FileItem {
  id: string;
  name: string;
  createdBy: string;
  lastModified?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  createdBy: string;
  parent: string | null;
  files?: FileItem[];
  folders?: FolderItem[];
}

async function readData(): Promise<FolderItem[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");

  return JSON.parse(raw);
}

async function writeData(data: FolderItem[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function getFolderById(id: string): Promise<FolderItem | null> {
  const data = await readData();
  return data.find((f) => f.id === id) || null;
}

export async function getSubfolders(parentId: string): Promise<FolderItem[]> {
  const data = await readData();
  return data.filter((f) => f.parent === parentId);
}

export async function getFolderTree(
  folderId: string
): Promise<FolderItem | null> {
  const data = await readData();
  const folder = data.find((f) => f.id === folderId);
  if (!folder) return null;

  const children = data
    .filter((f) => f.parent === folderId)
    .map((f) => buildSubTree(f, data));

  return { ...folder, folders: children };
}

function buildSubTree(
  folder: FolderItem,
  data: FolderItem[]
): FolderItem & { folders: any[] } {
  const children = data
    .filter((f) => f.parent === folder.id)
    .map((f) => buildSubTree(f, data));
  return { ...folder, folders: children };
}

export async function addFolder(folder: FolderItem): Promise<FolderItem> {
  const data = await readData();
  const exists = data.find((f) => f.id === folder.id);
  if (exists) throw new Error("Folder with this ID already exists");
  data.push({ ...folder, files: [] });
  await writeData(data);
  return folder;
}

export async function deleteFolder(id: string): Promise<void> {
  let data = await readData();
  const hasChildren = data.some((f) => f.parent === id);
  if (hasChildren) throw new Error("Cannot delete folder with subfolders");
  data = data.filter((f) => f.id !== id);
  await writeData(data);
}

export async function renameFolder(id: string, newName: string): Promise<void> {
  const data = await readData();
  const folder = data.find((f) => f.id === id);
  if (!folder) throw new Error("Folder not found");
  folder.name = newName;
  await writeData(data);
}

export async function addFileToFolder(
  folderId: string,
  file: FileItem
): Promise<FileItem> {
  const data = await readData();
  const folder = data.find((f) => f.id === folderId);
  if (!folder) throw new Error("Folder not found");
  folder.files?.push(file);
  await writeData(data);
  return file;
}

export async function deleteFileFromFolder(
  folderId: string,
  fileId: string
): Promise<void> {
  const data = await readData();
  const folder = data.find((f) => f.id === folderId);
  if (!folder) throw new Error("Folder not found");
  folder.files = folder.files?.filter((f) => f.id !== fileId);
  await writeData(data);
}

export async function getFileById(id: string): Promise<FileItem | null> {
  const data = await readData();
  const file = data.flatMap((f) => f.files).find((f) => f?.id === id);
  return file || null;
}
