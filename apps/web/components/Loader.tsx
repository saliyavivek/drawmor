import { Progress } from "./ui/progress";

export default function Loader({
  message,
  value,
}: {
  message: string;
  value?: number;
}) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4 w-100">
        {/* Progress Bar */}
        <Progress value={value} />

        {/* Message */}
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}
