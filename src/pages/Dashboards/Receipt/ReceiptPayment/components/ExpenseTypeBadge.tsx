import React from "react";
import { ReceiptPaymentExpenseType } from "types/receiptPayment";

interface ExpenseTypeBadgeProps {
  type: ReceiptPaymentExpenseType;
  customName?: string;
}

const ExpenseTypeBadge: React.FC<ExpenseTypeBadgeProps> = ({ type, customName }) => {
  const getTypeConfig = (type: ReceiptPaymentExpenseType) => {
    switch (type) {
      case ReceiptPaymentExpenseType.SUPPLIER_PAYMENT:
        return {
          label: "Chi tiền hàng NCC",
          className: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
        };
      case ReceiptPaymentExpenseType.TRANSPORTATION:
        return {
          label: "Vận chuyển",
          className: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
        };
      case ReceiptPaymentExpenseType.UTILITIES:
        return {
          label: "Tiện ích",
          className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
        };
      case ReceiptPaymentExpenseType.RENT:
        return {
          label: "Thuê mặt bằng",
          className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
        };
      case ReceiptPaymentExpenseType.LABOR:
        return {
          label: "Nhân công",
          className: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
        };
      case ReceiptPaymentExpenseType.OTHER:
        return {
          label: customName || "Khác",
          className: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
        };
      default:
        return {
          label: "Không xác định",
          className: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default ExpenseTypeBadge;