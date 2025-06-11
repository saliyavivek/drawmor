export default function Error({
  currUserName,
  error,
}: {
  currUserName: string | null;
  error: string | null;
}) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black">
      <p className="text-red-600 dark:text-white text-lg font-medium">
        {!currUserName
          ? "Please log in or create an account to proceed."
          : error}
      </p>
      <p className="text-xs sm:text-sm text-gray">
        <a href="/canvas" className="underline">
          Back
        </a>
      </p>
    </div>
  );
}
