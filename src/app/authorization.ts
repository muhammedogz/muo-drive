import "server-only";
import { stripObjectName } from "@/helpers/strip-object-name";
import { fgaClient } from "@/lib/fgaClient";
import { FolderItem } from "@/store/folders";

export async function authorizeRootFolder(userId: string): Promise<void> {
  const { allowed } = await fgaClient.check({
    user: `user:${userId}`,
    relation: "owner",
    object: `folder:${userId}`,
  });

  if (!allowed) {
    fgaClient.writeTuples([
      {
        user: `user:${userId}`,
        relation: "owner",
        object: `folder:${userId}`,
      },
    ]);
  }
}

// TODO: Check
export async function filterFoldersForUser(
  folders: Array<FolderItem>,
  user: string
): Promise<Array<FolderItem>> {
  const { responses } = await fgaClient.batchCheck(
    folders.map((folder) => {
      return {
        user: `user:${user}`,
        object: `folder:${folder?.id}`,
        relation: "can_view",
      };
    })
  );

  return responses
    .map((check) =>
      check.allowed
        ? folders.find(
            (folder) => folder?.id === stripObjectName(check._request.object)
          )
        : undefined
    )
    .filter(Boolean) as Array<FolderItem>;
}
