import { Progress } from "./ui/progress";

export default function Loader({
  message,
  value,
}: {
  message: string;
  value?: number;
}) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center space-y-4">
        {/* Progress Bar */}
        <Progress value={value} className="w-[400px]" />

        {/* Message */}
        <p className="text-gray-600 dark:text-white text-lg font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
