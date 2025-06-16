"use server";
import "server-only";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import {
  createFolderDTO,
  getAllOwnedFoldersDTO,
  getAllSharedFoldersDTO,
  getFolderDTO,
  shareFolderDTO,
} from "@/data/folders";
import { FileItem, FolderItem } from "@/store/folders";
import {
  createFileDTO,
  getAllSharedFilesDTO,
  shareFileDTO,
} from "@/data/files";

export async function getFolder(
  folderId: string
): Promise<{ folder?: FolderItem; error?: unknown }> {
  try {
    const { folder, error } = await getFolderDTO(folderId);

    if (folder) {
      return { folder };
    }

    return { error };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function getFoldersOwned(): Promise<{
  folders?: Array<FolderItem>;
  error?: unknown;
}> {
  try {
    const { folders, error } = await getAllOwnedFoldersDTO();
    if (folders) {
      return { folders };
    }

    return { error };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function getFoldersShared(): Promise<{
  folders?: Array<FolderItem>;
  error?: unknown;
}> {
  try {
    const { folders, error } = await getAllSharedFoldersDTO();
    if (folders) {
      return { folders };
    }

    return { error };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function getFilesShared(): Promise<{
  files?: Array<FileItem>;
  error?: unknown;
}> {
  try {
    const { files, error } = await getAllSharedFilesDTO();
    if (files) {
      return { files };
    }

    return { error };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function createFolder(
  name: string,
  parentFolderId?: string
): Promise<{ folder?: FolderItem; error?: unknown }> {
  try {
    // Create a random and unique id for the new folder
    const folderId = uuidv4();

    // Save the new folder to our Vercel Key/Value Store
    const { folder, error } = await createFolderDTO(
      folderId,
      name,
      parentFolderId
    );

    if (folder) {
      revalidatePath(`/dashboard`);

      return {
        folder,
      };
    }
    return { error };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function createFile(
  name: string,
  folderId: string
): Promise<{ file?: FileItem; error?: unknown }> {
  try {
    const fileId = uuidv4();
    const { file, error } = await createFileDTO(fileId, name, folderId);

    if (file) {
      revalidatePath(`/dashboard/${folderId}`);

      return { file };
    }
    return { error };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function shareFolder(
  folderId: string,
  email: string
): Promise<{ folder?: string; error?: unknown }> {
  try {
    const { folder, error } = await shareFolderDTO(folderId, email);

    if (folder) {
      return { folder };
    }

    return { error };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function shareFile(
  fileId: string,
  email: string
): Promise<{ file?: string; error?: unknown }> {
  try {
    const { file, error } = await shareFileDTO(fileId, email);

    if (file) {
      return { file };
    }

    return { error };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}
