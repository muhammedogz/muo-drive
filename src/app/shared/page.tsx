import Navigation from "@/components/navigation";
import Header from "@/components/header";
import { DriveHeader } from "@/components/drive/header";
import Drive from "@/components/drive/drive";
import { Error } from "@/components/error";
import { getFilesShared, getFoldersShared } from "@/app/actions";

export const dynamic = "force-dynamic";
export default async function Page() {
  const { folders, error } = await getFoldersShared();
  const { files, error: filesError } = await getFilesShared();

  return (
    <div className="flex min-h-screen w-full bg-gray-100/40">
      <Navigation />
      <div className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 overflow-auto p-4">
          {!!error && <Error message={JSON.stringify(error)}></Error>}
          {!!filesError && <Error message={JSON.stringify(filesError)}></Error>}
          <DriveHeader name="Shared with me" />
          <Drive folders={folders} files={files} />
        </main>
      </div>
    </div>
  );
}
