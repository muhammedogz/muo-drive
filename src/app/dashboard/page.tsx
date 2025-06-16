import Navigation from "@/components/navigation";
import Drive from "@/components/drive/drive";
import Header from "@/components/header";
import { getUserId } from "@/data/user";
import { DriveHeader } from "@/components/drive/header";
import { Error } from "@/components/error";
import { getFolder, getFoldersOwned } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { folders, error: foldersError } = await getFoldersOwned();

  return (
    <>
      {!!foldersError && <Error message={JSON.stringify(foldersError)}></Error>}

      <DriveHeader name="Home" />
      <Drive folders={folders} />
    </>
  );
}
