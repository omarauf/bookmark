import { createFileRoute } from "@tanstack/react-router";
import { List, type RowComponentProps } from "react-window";

export const Route = createFileRoute("/_authenticated/instagram/temp")({
  component: RouteComponent,
});

const names = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

function RouteComponent() {
  return (
    <div className="w-200 overflow-scroll">
      <List
        rowComponent={RowComponent}
        rowCount={names.length}
        rowHeight={25}
        rowProps={{ names }}
        onRowsRendered={({ startIndex, stopIndex }) => {
          console.log("Rendered rows:", startIndex, stopIndex);
        }}
      />
    </div>
  );
}

function RowComponent({
  index,
  names,
  style,
}: RowComponentProps<{
  names: string[];
}>) {
  return (
    <div className="flex items-center justify-between" style={style}>
      {names[index]}
      <div className="text-slate-500 text-xs">{`${index + 1} of ${names.length}`}</div>
    </div>
  );
}
