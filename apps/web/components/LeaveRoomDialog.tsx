import { Button } from "./ui/button";
import {
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
        <DialogTitle>Are you sure you want to leave?</DialogTitle>
        <DialogDescription>
          Don't worry, you can rejoin anytime using the canvas name. Your
          drawings are safe.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={handleLeave}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  );
}
