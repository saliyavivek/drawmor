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
import { Check, Copy, Globe, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";

export function ShareDialog({
  handleCopyLink,
}: {
  handleCopyLink: () => void;
}) {
  const [generalAccess, setGeneralAccess] = useState("invited");

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Invite people to collaborate</DialogTitle>
        <DialogDescription>
          Share this link with others and enjoy creating together in real time.
        </DialogDescription>
      </DialogHeader>
      {/* <div className="flex items-center space-x-2">
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
      </div> */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-300">General access</h3>

        <Select value={generalAccess} onValueChange={setGeneralAccess}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="invited" className="text-white">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Only people invited</span>
                </div>
                {generalAccess === "invited" && <Check className="h-4 w-4" />}
              </div>
            </SelectItem>
            <SelectItem value="link" className="text-white">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Anyone on the web with link</span>
                </div>
                {generalAccess === "link" && <Check className="h-4 w-4" />}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {generalAccess === "link" && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              Copy link
            </Button>
          </div>
        )}
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
