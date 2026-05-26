type NoDataProps = {
  name?: string;
};

export default function NoData({ name = "Data" }: NoDataProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
          No {name}
        </p>
      </div>
    </div>
  );
}
