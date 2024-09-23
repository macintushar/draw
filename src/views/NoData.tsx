type NoDataProps = {
  name?: string;
};

export default function NoData({ name = "Data" }: NoDataProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div>
        <h1>No {name}</h1>
      </div>
    </div>
  );
}
