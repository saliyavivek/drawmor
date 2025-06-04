import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

export function InviteDialog({
  handleCopyLink,
}: {
  handleCopyLink: () => void;
}) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Invite people to collaborate</DialogTitle>
        <DialogDescription>
          Share this link with others and enjoy creating together in real time.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            defaultValue={
              typeof window !== "undefined" ? window.location.href : ""
            }
            readOnly
          />
        </div>
        <Button
          onClick={handleCopyLink}
          type="submit"
          size="sm"
          className="px-3"
          variant="outline"
        >
          <span className="sr-only">Copy</span>
          <Copy />
        </Button>
      </div>

      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
