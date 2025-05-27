import { RECEIPT_IMPORT_STATUS } from "Common/constants/receipt-constant";

export const ReceiptStatus = ({ item }: any) => {
  switch (item) {
    case RECEIPT_IMPORT_STATUS.DRAFT:
      return (
        <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20">
          Phiếu nháp
        </span>
      );
    case RECEIPT_IMPORT_STATUS.PROCESSING:
      return (
        <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-purple-100 border-purple-200 text-purple-500 dark:bg-purple-500/20 dark:border-purple-500/20">
          Đang xử lý
        </span>
      );
    case RECEIPT_IMPORT_STATUS.WAITING:
      return (
        <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-orange-100 border-orange-200 text-orange-500 dark:bg-orange-500/20 dark:border-orange-500/20">
          Đang chờ duyệt
        </span>
      )
    case RECEIPT_IMPORT_STATUS.COMPLETED:
      return (
        <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20">
          Đã hoàn thành
        </span>
      );
    case RECEIPT_IMPORT_STATUS.CANCELLED:
      return (
        <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-red-100 border-red-200 text-red-500 dark:bg-red-500/20 dark:border-red-500/20">
          Đã hủy
        </span>
      );
    case RECEIPT_IMPORT_STATUS.OVER_RECEIVED:
      return (
        <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-yellow-100 border-yellow-200 text-yellow-500 dark:bg-yellow-500/20 dark:border-yellow-500/20">
          Giao dư
        </span>
      );
    case RECEIPT_IMPORT_STATUS.SHORT_RECEIVED:
      return (
        <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-sky-100 border-sky-200 text-sky-500 dark:bg-sky-500/20 dark:border-sky-500/20 dark:text-zink-200">
          Giao thiếu
        </span>
      );
    default:
      return (
        <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20">
          {item}
        </span>
      );
  }
};