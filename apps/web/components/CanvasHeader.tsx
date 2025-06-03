import { Copy, LogOut, Palette, Settings, Share2, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import { ShareDialog } from "./ShareDialog";
import LeaveRoomDialog from "./LeaveRoomDialog";

export default function CanvasHeader({
  slug,
  userCount,
  handleLeave,
}: {
  slug: string;
  userCount: number;
  handleLeave: () => void;
}) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied to clipboard.");
  };

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Palette className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Canvas: {slug}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {userCount} online
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={handleCopyLink} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <ShareDialog handleCopyLink={handleCopyLink} />
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
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
