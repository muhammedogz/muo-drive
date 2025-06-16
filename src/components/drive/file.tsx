import { TableRow, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShareFile } from "@/components/drive/share-file";
import { FileItem } from "@/store/folders";
import { FileIcon } from "lucide-react";

export function DriveFile({ file }: { file: FileItem }) {
  return (
    <TableRow>
      <TableCell>
        <FileIcon />
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger>{file?.name}</DialogTrigger>
          <DialogContent className="w-[calc(80vw)] max-w-[calc(80vw)] h-[calc(80vh)]">
            <DialogHeader>
              <DialogTitle>{file?.name}</DialogTitle>
              <DialogDescription>
                Last updated on <strong>{file?.lastModified}</strong>.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell>{file?.lastModified}</TableCell>
      <TableCell>
        <ShareFile file={file} />
      </TableCell>
    </TableRow>
  );
}
