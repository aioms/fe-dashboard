import React from "react";
import { formatMoney } from "helpers/utils";
import { NoTableResult } from "Common/Components/NoTableResult";
import type { IInventoryRecord } from "../index.d";

interface InventoryHistoryProps {
  records: IInventoryRecord[];
}

const InventoryHistory: React.FC<InventoryHistoryProps> = ({ records }) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "import":
        return "Nhập kho";
      case "export":
        return "Xuất kho";
      case "adjustment":
        return "Điều chỉnh";
      default:
        return type;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "px-2.5 py-0.5 inline-block text-xs font-medium rounded border";
    
    switch (type) {
      case "import":
        return `${baseClasses} bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent`;
      case "export":
        return `${baseClasses} bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent`;
      case "adjustment":
        return `${baseClasses} bg-orange-100 border-transparent text-orange-500 dark:bg-orange-500/20 dark:border-transparent`;
      default:
        return `${baseClasses} bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20 dark:text-zink-200`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h5 className="text-lg font-medium">Lịch sử xuất nhập kho</h5>
        <span className="text-sm text-slate-500">
          Tổng {records.length} giao dịch
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-left bg-slate-100 dark:bg-zink-600">
            <tr>
              <th className="p-3">Ngày</th>
              <th className="p-3">Loại giao dịch</th>
              <th className="p-3">Số lượng</th>
              <th className="p-3">Lý do</th>
              <th className="p-3">Tham chiếu</th>
              <th className="p-3">Tồn kho sau GD</th>
              <th className="p-3">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record) => (
                <tr key={record.id} className="border-b border-slate-200 dark:border-zink-500">
                  <td className="p-3">
                    <div className="text-sm">
                      {formatDate(record.date)}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={getTypeBadge(record.type)}>
                      {getTypeLabel(record.type)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${
                      record.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {record.quantity > 0 ? "+" : ""}{record.quantity}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="max-w-xs truncate" title={record.reason}>
                      {record.reason}
                    </div>
                  </td>
                  <td className="p-3">
                    {record.reference ? (
                      <span className="text-custom-500 font-medium">
                        {record.reference}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="font-medium">
                      {record.remainingStock}
                    </span>
                  </td>
                  <td className="p-3">
                    {record.note ? (
                      <div className="max-w-xs truncate" title={record.note}>
                        {record.note}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  <NoTableResult />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryHistory;