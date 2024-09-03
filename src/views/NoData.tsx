type NoDataProps = {
  name?: string;
};

export default function NoData({ name = "Data" }: NoDataProps) {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div>
        <h1>No {name}</h1>
      </div>
    </div>
  );
}
