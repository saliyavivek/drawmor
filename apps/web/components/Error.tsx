export default function Error({
  currUserName,
  error,
  backUrl,
}: {
  currUserName?: string | null;
  error: string | null;
  backUrl: string;
}) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white mx-2 dark:bg-black text-center">
      <p className="text-red-600 dark:text-white text-lg font-medium">
        {!currUserName
          ? "Please log in or create an account to proceed."
          : error}
      </p>
      <p className="text-xs sm:text-sm text-gray mt-2">
        <a href={backUrl} className="underline">
          Back
        </a>
      </p>
    </div>
  );
}
