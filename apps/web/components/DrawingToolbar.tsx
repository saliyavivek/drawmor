"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Lock,
  Hand,
  MousePointer,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  ImageIcon,
  Eraser,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tool } from "@/types/types";

interface DrawingToolbarProps {
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  className?: string;
}

export default function DrawingToolbar({
  selectedTool,
  onToolChange,
  className,
}: DrawingToolbarProps) {
  const tools = [
    { id: "lock" as Tool, icon: Lock, label: "Lock/Unlock" },
    { id: "hand" as Tool, icon: Hand, label: "Hand Tool" },
    {
      id: "select" as Tool,
      icon: MousePointer,
      label: "Selection Tool",
    },
    {
      id: "rectangle" as Tool,
      icon: Square,
      label: "Rectangle",
    },
    { id: "diamond" as Tool, icon: Diamond, label: "Diamond" },
    { id: "circle" as Tool, icon: Circle, label: "Circle" },
    { id: "arrow" as Tool, icon: ArrowRight, label: "Arrow" },
    { id: "line" as Tool, icon: Minus, label: "Line" },
    { id: "pencil" as Tool, icon: Pencil, label: "Pencil" },
    { id: "text" as Tool, icon: Type, label: "Text" },
    { id: "image" as Tool, icon: ImageIcon, label: "Image" },
    { id: "eraser" as Tool, icon: Eraser, label: "Eraser" },
    {
      id: "collaborate" as Tool,
      icon: Users,
      label: "Collaborate",
    },
  ];

  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-xl shadow-lg p-2">
        <TooltipProvider>
          <div className="flex items-center space-x-1">
            {tools.map((tool, index) => (
              <div key={tool.id} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-10 w-10 rounded-lg transition-all duration-200",
                        selectedTool === tool.id
                          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                      onClick={() => onToolChange(tool.id)}
                    >
                      <tool.icon className="h-5 w-5" />
                      <span className="sr-only">{tool.label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-sm">
                    <p>{tool.label}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
