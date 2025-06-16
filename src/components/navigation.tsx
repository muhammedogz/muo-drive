"use client";
import Link from "next/link";
import {
  ClockIcon,
  FolderIcon,
  StarIcon,
  TrashIcon,
  UsersIcon,
} from "@/components/icons";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="hidden w-[300px] border-r lg:block">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                pathname === "/dashboard"
                  ? "bg-gray-100 text-gray-900 transition-all hover:text-gray-900"
                  : "rounded-lg text-gray-500 transition-all hover:text-gray-900"
              }`}
              href="/dashboard"
            >
              <FolderIcon className="h-4 w-4" />
              My Drive
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                pathname === "/shared"
                  ? "bg-gray-100 text-gray-900 transition-all hover:text-gray-900"
                  : "rounded-lg text-gray-500 transition-all hover:text-gray-900"
              }`}
              href="/shared"
            >
              <UsersIcon className="h-4 w-4" />
              Shared with me
            </Link>
            <hr className="my-4" />
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 cursor-not-allowed`}
              href="#"
            >
              <ClockIcon className="h-4 w-4" />
              Recent
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 cursor-not-allowed`}
              href="#"
            >
              <StarIcon className="h-4 w-4" />
              Starred
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 cursor-not-allowed`}
              href="#"
            >
              <TrashIcon className="h-4 w-4" />
              Trash
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
