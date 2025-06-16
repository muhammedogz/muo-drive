"use client";
import { DriveSkeleton } from "@/components/drive/skeleton";
import { DriveEmpty } from "@/components/drive/empty";
import { DriveTable } from "@/components/drive/table";
import { DriveFolder } from "@/components/drive/folder";
import { FileItem, FolderItem } from "@/store/folders";
import { DriveFile } from "@/components/drive/file";

export interface DriveProps {
  folders?: Array<FolderItem>;
  files?: Array<FileItem>;
}

export default function Drive({ folders = [], files = [] }: DriveProps) {
  const isEmpty = folders?.length === 0 && files?.length === 0;

  return (
    <div className="p-2">
      {folders === undefined && <DriveSkeleton />}
      {isEmpty && <DriveEmpty />}
      {!isEmpty && (
        <DriveTable>
          {folders?.map((folder) => {
            return <DriveFolder folder={folder} key={folder?.id} />;
          })}
          {files?.map((file) => {
            return <DriveFile file={file} key={file?.id} />;
          })}
        </DriveTable>
      )}
    </div>
  );
}
