export interface SupplierReturnStockRow {
  name: string;
  quantity: number;
  inventory?: number;
}

export function findSupplierReturnOverstockItem(
  rows: SupplierReturnStockRow[]
): { name: string; quantity: number; inventory: number } | null {
  const item = rows.find((row) => row.quantity > (row.inventory ?? 0));
  if (!item) {
    return null;
  }

  return {
    name: item.name,
    quantity: item.quantity,
    inventory: item.inventory ?? 0,
  };
}

export function getSupplierReturnOverstockMessage(
  item: NonNullable<ReturnType<typeof findSupplierReturnOverstockItem>>
): string {
  return `Sản phẩm "${item.name}" không đủ tồn kho để trả nhà cung cấp (tồn ${item.inventory}, trả ${item.quantity})`;
}
