import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function LeaveRoomDialog({
  handleLeave,
}: {
  handleLeave: () => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Leaving so soon?</DialogTitle>
        <DialogDescription>
          Don&apos;t worry, you can rejoin anytime using the canvas name. Your
          drawings are safe.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleLeave}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  );
}
