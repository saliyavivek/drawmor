import { Copy, LogOut, Palette, Share2, User, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import { InviteDialog } from "./InviteDialog";
import LeaveRoomDialog from "./LeaveRoomDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useAtomValue } from "jotai";
import { nameAtom } from "@/app/store/atoms/authAtoms";

export default function CanvasHeader({
  slug,
  users,
  handleLeave,
}: {
  slug: string;
  users: string[];
  handleLeave: () => void;
}) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied to clipboard.");
  };

  const currentUsername = useAtomValue(nameAtom);

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <img src="/logo_colored.png" alt="Drawmor Logo" />
            </div>
            <div>
              <h1 className="font-semibold">Canvas: {slug}</h1>
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {users.length} online
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col space-y-1 font-semibold">
                      {users.map((user, index) => (
                        <p key={index}>
                          {user}
                          {user === currentUsername && " (you)"}
                        </p>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={handleCopyLink} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4" />
                  Invite
                </Button>
              </DialogTrigger>
              <InviteDialog handleCopyLink={handleCopyLink} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4" />
                  Leave
                </Button>
              </DialogTrigger>
              <LeaveRoomDialog handleLeave={handleLeave} />
            </Dialog>
          </div>
        </div>
      </header>
    </>
  );
}
