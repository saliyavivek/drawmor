import { Progress } from "./ui/progress";

export default function ProgressBar({
  message,
  value,
}: {
  message: string;
  value?: number;
}) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black px-4">
      <div className="flex flex-col items-center space-y-4 w-full max-w-[400px]">
        {/* Progress Bar */}
        <Progress value={value} className="w-full" />

        {/* Message */}
        <p className="text-gray-600 dark:text-white text-lg font-medium text-center">
          {message}
        </p>
      </div>
    </div>
  );
}
