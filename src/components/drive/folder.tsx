import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FolderItem } from "@/store/folders";
import Link from "next/link";
import { ShareFolder } from "@/components/drive/share-folder";
import { FolderIcon } from "lucide-react";

export function DriveFolder({ folder }: { folder: FolderItem }) {
  return (
    <TableRow>
      <TableCell>
        <FolderIcon />
      </TableCell>
      <TableCell>
        <Link href={`/dashboard/${folder?.id}`}>{folder?.name}</Link>
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        <ShareFolder folder={folder} />
      </TableCell>
    </TableRow>
  );
}
