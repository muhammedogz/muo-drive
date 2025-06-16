"use client";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useTransition } from "react";
import { createFile, createFolder } from "@/app/actions";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, FileUpIcon, FolderIcon } from "lucide-react";

interface DriveHeaderProps {
  name?: string | null;
  parentFolderId?: string;
}

export function DriveHeader({ name, parentFolderId }: DriveHeaderProps) {
  const { toast } = useToast();
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [isPending, startTransition] = useTransition();
  function handleChangeNewFolderName(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setNewFolderName(event.target.value);
  }

  const router = useRouter();

  async function handleCreateFolder() {
    const { folder, error } = await createFolder(newFolderName, parentFolderId);

    if (folder) {
      toast({
        title: "Folder created",
        description: `The folder ${newFolderName} has been created successfully!`,
      });
      router.push(`/dashboard/${folder.id}`);
      setNewFolderName("");
    }

    if (error) {
      toast({
        title: "Something went wrong creating the new folder",
        description: JSON.stringify(error),
        variant: "destructive",
      });
    }
  }

  async function handleCreateFile() {
    if (!parentFolderId) {
      toast({
        title: "No parent folder selected",
        description: "Please select a parent folder to create a file",
        variant: "destructive",
      });
      return;
    }
    const { file, error } = await createFile(newFileName, parentFolderId);

    if (file) {
      toast({
        title: "File created",
        description: `The file ${newFileName} has been created successfully!`,
      });
      router.push(`/dashboard/${parentFolderId}`);
    }
  }

  return (
    <div className="flex justify-between m-2 bg-slate-100 rounded-lg p-4">
      <h1 className="font-semibold text-2xl align-middle leading-relaxed">
        <Link href="/dashboard">My Drive</Link>
        {name && (
          <>
            <ChevronRightIcon className="inline-block" />{" "}
            <span className="font-normal">{name}</span>
          </>
        )}
      </h1>

      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Folder Name
              </Label>
              <Input
                id="email"
                className="col-span-3"
                value={newFolderName}
                onChange={handleChangeNewFolderName}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleCreateFolder}>
                {isPending ? "Creating..." : "Create folder"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FolderIcon className="mr-2" /> Add Folder
          </Button>
        </DialogTrigger>
      </Dialog>

      {parentFolderId && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new file</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  File Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleCreateFile}>
                  {isPending ? "Creating..." : "Create file"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileUpIcon className="mr-2" /> Add File
            </Button>
          </DialogTrigger>
        </Dialog>
      )}
    </div>
  );
}
