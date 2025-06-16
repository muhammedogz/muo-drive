import "server-only";
import { isAuthenticated } from "@/app/authentication";
import { getUserId } from "@/data/user";
import { addFileToFolder, FileItem, getFileById } from "@/store/folders";
import { auth0ManagementClient } from "@/lib/auth0-management";
import { stripObjectName } from "@/helpers/strip-object-name";
import { fgaClient } from "@/lib/fgaClient";

export async function getAllSharedFilesDTO(): Promise<{
  files?: FileItem[];
  error?: unknown;
}> {
  try {
    if (await !isAuthenticated()) {
      return { error: "Unauthorized" };
    }

    const userId = await getUserId();
    // batch check all files the user has access to
    const res = await fgaClient.listObjects({
      type: "file",
      user: `user:${userId}`,
      relation: "temp_user",
    });

    const filesRes = res.objects.map((objectId) => {
      const fileId = stripObjectName(objectId);
      return getFileById(fileId);
    });

    const files = (await Promise.all(filesRes)).filter(Boolean) as FileItem[];

    if (files.length === 0) {
      return { error: "No files found" };
    }

    return { files: files };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function createFileDTO(
  fileId: string,
  name: string,
  folderId: string
): Promise<{ file?: FileItem; error?: unknown }> {
  try {
    if (await !isAuthenticated()) {
      return { error: "Unauthorized" };
    }

    const userId = await getUserId();

    const file = await addFileToFolder(folderId, {
      id: fileId,
      name: name,
      createdBy: userId,
    });

    if (file) {
      await fgaClient.writeTuples([
        {
          user: `folder:${folderId}`,
          relation: "parent",
          object: `file:${fileId}`,
        },
      ]);

      return { file };
    }

    return { error: "No file was created" };
  } catch (error) {
    return { error };
  }
}

export async function shareFileDTO(
  fileId: string,
  email: string
): Promise<{ file?: string; error?: unknown }> {
  try {
    if (await !isAuthenticated()) {
      return { error: "Unauthorized" };
    }

    const userId = await getUserId();
    const { allowed } = await fgaClient.check({
      user: `user:${userId}`,
      relation: "can_share",
      object: `file:${fileId}`,
    });

    if (!allowed) {
      return { error: "Forbidden" };
    }

    try {
      // Check the Auth0 management API for a user with the given email address
      const { data } = await auth0ManagementClient.usersByEmail.getByEmail({
        email,
      });

      // No known user with the email address, return an error
      if (data.length === 0) {
        return { error: "A user with this email address does not exist." };
      }

      // Write a new OpenFGA tuple to share the folder
      await fgaClient.writeTuples([
        {
          user: `user:${data[0].user_id}`,
          relation: "temp_user",
          object: `file:${fileId}`,
        },
      ]);

      return { file: fileId };
    } catch (error) {
      return { error: "User not found" };
    }
  } catch (error) {
    return { error: "Something went wrong." };
  }
}
