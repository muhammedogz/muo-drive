import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getUserDTO } from "@/data/user";
import { HardDriveIcon, SearchIcon } from "lucide-react";

export default async function Header() {
  const user = await getUserDTO();

  return (
    <header className="flex h-14 items-center gap-4 border-b pr-6">
      <div className="min-w-[300px] flex-1 flex h-14 items-center border-b border-r pl-6">
        <HardDriveIcon className="h-6 w-6" />
        <h1 className="ml-2 font-semibold">Muo Drive</h1>
      </div>
      {/* TODO: add sidebar toggle */}
      {/* <Button className="rounded-full w-8 h-8" size="icon">
        <MenuIcon className="w-4 h-4" />
        <span className="sr-only">Toggle sidebar</span>
      </Button> */}
      <div className="w-full">
        <form>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
              placeholder="Search"
              type="search"
            />
          </div>
        </form>
      </div>
      <div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback>
                  {user?.name &&
                    user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {/* TODO: add logout */}
                {/* <Link href="/auth/logout">Logout</Link> */}
                <a href="/auth/logout">Logout</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
