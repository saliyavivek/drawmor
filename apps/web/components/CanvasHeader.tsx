"use client";

import {
  LogOut,
  MessageCircle,
  User,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { InviteDialog } from "./InviteDialog";
import LeaveRoomDialog from "./LeaveRoomDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useAtomValue } from "jotai";
import { usernameAtom } from "@/app/store/atoms/authAtoms";
import { ModeToggle } from "./ModeToggle";
import { useState } from "react";

export default function CanvasHeader({
  slug,
  users,
  handleLeave,
  setShowChat,
  roomAdmin,
  username,
}: {
  slug: string;
  users: string[];
  handleLeave: () => void;
  setShowChat: any;
  roomAdmin: string;
  username: string;
}) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.href.replace(
      "/canvas/create/",
      "/canvas/join/"
    );
    navigator.clipboard.writeText(url);
    toast("Link copied to clipboard.");
  };

  const currentUsername = useAtomValue(usernameAtom);

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          {/* Left side - Logo and Canvas info */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src="/logo_colored.png"
                alt="Drawmor Logo"
                width={20}
                height={20}
                className="w-full h-full rounded"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-sm sm:text-base truncate">
                {/* <span className="hidden sm:inline">Canvas: </span> */}
                {slug}
              </h1>
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="xs:hidden">{users.length} online</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col space-y-1 font-semibold">
                      {users.map((user, index) => (
                        <p key={index}>
                          {user}
                          {user === currentUsername && " (you)"}
                          {user === roomAdmin && user !== username
                            ? " (owner)"
                            : ""}
                        </p>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                onClick={() => setShowChat((prev: boolean) => !prev)}
                variant="outline"
                size="sm"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
              {roomAdmin === currentUsername && (
                <Dialog
                  open={showInviteDialog}
                  onOpenChange={setShowInviteDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4" />
                      Invite
                    </Button>
                  </DialogTrigger>
                  <InviteDialog handleCopyLink={handleCopyLink} />
                </Dialog>
              )}
              <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LogOut className="h-4 w-4" />
                    Leave
                  </Button>
                </DialogTrigger>
                <LeaveRoomDialog handleLeave={handleLeave} />
              </Dialog>
              <ModeToggle />
            </div>

            {/* Mobile Chat Button */}
            <Button
              onClick={() => setShowChat((prev: boolean) => !prev)}
              variant="outline"
              size="sm"
              className="md:hidden"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="sr-only">Toggle Chat</span>
            </Button>

            {/* Mobile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {roomAdmin === currentUsername && (
                  <>
                    <DropdownMenuItem
                      onClick={() => setShowInviteDialog(true)}
                      className="flex items-center cursor-pointer"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Invite Users
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => setShowLeaveDialog(true)}
                  className="flex items-center cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Room
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme</span>
                    <ModeToggle />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Dialogs */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <InviteDialog handleCopyLink={handleCopyLink} />
      </Dialog>

      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <LeaveRoomDialog handleLeave={handleLeave} />
      </Dialog>
    </>
  );
}
