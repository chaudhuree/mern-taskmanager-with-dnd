export default function Spinner() {
  return (
    <div className="bg-white dark:bg-gray-800  flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-50 container mx-auto">
      <div>
        <span className="loading loading-ball loading-lg h-24 dark:bg-gray-300"></span>
      </div>
    </div>
  );
}