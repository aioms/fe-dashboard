import { InventoryChangeType } from "../index.d";

export const getChangeTypeLabel = (changeType: InventoryChangeType) => {
  switch (changeType) {
    case InventoryChangeType.IMPORT:
      return "Nhập kho";
    case InventoryChangeType.RETURN:
      return "Trả hàng";
    case InventoryChangeType.CHECK:
      return "Kiểm kho";
    case InventoryChangeType.DEBT:
      return "Công nợ";
    case InventoryChangeType.MANUAL:
      return "Điều chỉnh thủ công";
    case InventoryChangeType.SYSTEM:
      return "Điều chỉnh hệ thống";
    case InventoryChangeType.ORDER:
      return "Đơn hàng";
    default:
      return changeType;
  }
};

export const getChangeTypeBadge = (changeType: InventoryChangeType) => {
  const baseClasses = "px-2.5 py-0.5 inline-block text-xs font-medium rounded border";

  switch (changeType) {
    case InventoryChangeType.IMPORT:
      return `${baseClasses} bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent`;
    case InventoryChangeType.RETURN:
      return `${baseClasses} bg-purple-100 border-transparent text-purple-500 dark:bg-purple-500/20 dark:border-transparent`;
    case InventoryChangeType.CHECK:
      return `${baseClasses} bg-blue-100 border-transparent text-blue-500 dark:bg-blue-500/20 dark:border-transparent`;
    case InventoryChangeType.DEBT:
      return `${baseClasses} bg-yellow-100 border-transparent text-yellow-600 dark:bg-yellow-500/20 dark:border-transparent`;
    case InventoryChangeType.MANUAL:
      return `${baseClasses} bg-orange-100 border-transparent text-orange-500 dark:bg-orange-500/20 dark:border-transparent`;
    case InventoryChangeType.SYSTEM:
      return `${baseClasses} bg-gray-100 border-transparent text-gray-500 dark:bg-gray-500/20 dark:border-transparent`;
    case InventoryChangeType.ORDER:
      return `${baseClasses} bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent`;
    default:
      return `${baseClasses} bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20 dark:text-zink-200`;
  }
};

export const getReferenceLink = (referenceId: string, changeType?: InventoryChangeType) => {
  if (!referenceId) return null;

  // Map reference types to their respective detail page routes
  switch (changeType) {
    case InventoryChangeType.IMPORT:
      return `/receipt-import/update?id=${referenceId}`;
    case InventoryChangeType.RETURN:
      return `/receipt-return/update?id=${referenceId}`;
    case InventoryChangeType.DEBT:
      return `/receipt-debt/detail/${referenceId}`;
    // case InventoryChangeType.CHECK:
    //   return `/receipt-check/update?id=${referenceId}`;
    case InventoryChangeType.ORDER:
      return `/orders/${referenceId}`;
    default:
      // If no reference type is provided, try to infer from the ID format
      if (referenceId.startsWith("IMP")) return `/receipts/import/${referenceId}`;
      if (referenceId.startsWith("RET")) return `/receipts/return/${referenceId}`;
      if (referenceId.startsWith("DEB")) return `/receipts/debt/${referenceId}`;
      if (referenceId.startsWith("CHK")) return `/inventory/checks/${referenceId}`;
      if (referenceId.startsWith("ORD")) return `/orders/${referenceId}`;
      return null;
  }
};