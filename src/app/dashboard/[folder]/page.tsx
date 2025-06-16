import Navigation from "@/components/navigation";
import Drive from "@/components/drive/drive";
import Header from "@/components/header";
import { DriveHeader } from "@/components/drive/header";
import { Error } from "@/components/error";
import { getFolder, getFoldersOwned } from "@/app/actions";

export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: { folder: string } }) {
  const { folder: currentFolder, error: currentFolderError } = await getFolder(
    params.folder
  );

  return (
    <>
      {!!currentFolderError && (
        <Error message={JSON.stringify(currentFolderError)}></Error>
      )}
      <DriveHeader name={currentFolder?.name} parentFolderId={params.folder} />
      <Drive folders={currentFolder?.folders} files={currentFolder?.files} />
    </>
  );
}
