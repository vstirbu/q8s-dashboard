import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOut } from "@/components/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";
import Link from "next/link";

export function UserDropdownMenu(props: { user: Session["user"] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={props.user?.image!} alt={props.user?.name!} />
            <AvatarFallback>
              <CircleUser className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/account/settings">Settings</Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
