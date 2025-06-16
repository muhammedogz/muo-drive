import "server-only";
import { isAuthenticated } from "@/app/authentication";
import { getUserId } from "@/data/user";
import {
  addFolder,
  FolderItem,
  getFolderById,
  getFolderTree,
  getSubfolders,
} from "@/store/folders";
import { auth0ManagementClient } from "@/lib/auth0-management";
import { stripObjectName } from "@/helpers/strip-object-name";
import { fgaClient } from "@/lib/fgaClient";

export async function getFolderDTO(
  folderId: string
): Promise<{ folder?: FolderItem; error?: unknown }> {
  try {
    if (await !isAuthenticated()) {
      return { error: "Unauthorized" };
    }

    const userId = await getUserId();
    const { allowed } = await fgaClient.check({
      user: `user:${userId}`,
      relation: "can_view",
      object: `folder:${folderId}`,
    });

    if (!allowed) {
      return { error: "Forbidden" };
    }

    const folder = await getFolderTree(folderId);

    if (folder) {
      return {
        folder,
      };
    }

    return { error: "No folder found" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function getAllOwnedFoldersDTO(): Promise<{
  folders?: FolderItem[];
  error?: unknown;
}> {
  try {
    if (await !isAuthenticated()) {
      return { error: "Unauthorized" };
    }

    const userId = await getUserId();
    // batch check all folders the user has access to
    const res = await fgaClient.listObjects({
      type: "folder",
      user: `user:${userId}`,
      relation: "owner",
    });

    const foldersRes = res.objects.map((objectId) => {
      const folderId = stripObjectName(objectId);
      return getFolderById(folderId);
    });

    const folders = (await Promise.all(foldersRes)).filter(
      Boolean
    ) as FolderItem[];

    if (folders.length === 0) {
      return { error: "No folders found" };
    }

    return { folders: folders };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function getAllSharedFoldersDTO(): Promise<{
  folders?: FolderItem[];
  error?: unknown;
}> {
  try {
    if (await !isAuthenticated()) {
      return { error: "Unauthorized" };
    }

    const userId = await getUserId();
    // batch check all folders the user has access to
    const res = await fgaClient.listObjects({
      type: "folder",
      user: `user:${userId}`,
      relation: "temp_user",
    });

    const foldersRes = res.objects.map((objectId) => {
      const folderId = stripObjectName(objectId);
      return getFolderById(folderId);
    });

    const folders = (await Promise.all(foldersRes)).filter(
      Boolean
    ) as FolderItem[];

    if (folders.length === 0) {
      return { error: "No folders found" };
    }

    return { folders: folders };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function createFolderDTO(
  folderId: string,
  name: string,
  parentFolderId?: string
): Promise<{ folder?: FolderItem; error?: unknown }> {
  try {
    if (await !isAuthenticated()) {
      return { error: "Unauthorized" };
    }

    const userId = await getUserId();

    const folder = await addFolder({
      id: folderId,
      name: name,
      parent: parentFolderId ?? null,
      createdBy: userId,
    });

    if (folder) {
      // Write OpenFGA tuples for the new folder
      await fgaClient.writeTuples([
        {
          user: `user:${userId}`,
          relation: "owner",
          object: `folder:${folderId}`,
        },
        // If there is a parent folder, add the folder to the parent folder
        ...(parentFolderId
          ? [
              {
                user: `folder:${parentFolderId}`,
                relation: "parent",
                object: `folder:${folderId}`,
              },
            ]
          : []),
      ]);

      return { folder };
    }

    return { error: "No folder was created" };
  } catch (error) {
    return { error };
  }
}

export async function shareFolderDTO(
  folderId: string,
  email: string
): Promise<{ folder?: string; error?: unknown }> {
  try {
    if (await !isAuthenticated()) {
      return { error: "Unauthorized" };
    }

    const userId = await getUserId();
    const { allowed } = await fgaClient.check({
      user: `user:${userId}`,
      relation: "can_share",
      object: `folder:${folderId}`,
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
          object: `folder:${folderId}`,
        },
      ]);

      return { folder: folderId };
    } catch (error) {
      return { error: "User not found" };
    }
  } catch (error) {
    return { error };
  }
}
