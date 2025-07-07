import { JSX, memo, useMemo } from "react";
import { FixedSizeList as List } from "react-window";

interface VirtualizedListProps {
  items: any[];
  height: number;
  itemHeight: number;
  renderItem: (props: any) => JSX.Element;
}

export const VirtualizedList = memo(
  ({ items, height, itemHeight, renderItem }: VirtualizedListProps) => {
    const itemCount = useMemo(() => items.length, [items.length]);

    const Row = memo(({ index, style }: { index: number; style: any }) => (
      <div style={style}>{renderItem({ item: items[index], index })}</div>
    ));

    Row.displayName = "VirtualizedRow";

    return (
      <List
        height={height}
        itemCount={itemCount}
        itemSize={itemHeight}
        width="100%"
      >
        {Row}
      </List>
    );
  }
);

VirtualizedList.displayName = "VirtualizedList";
