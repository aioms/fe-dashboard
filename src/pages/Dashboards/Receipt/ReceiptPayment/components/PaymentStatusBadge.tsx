import React from "react";
import { ReceiptPaymentStatus } from "types/receiptPayment";

interface PaymentStatusBadgeProps {
  status: ReceiptPaymentStatus;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: ReceiptPaymentStatus) => {
    switch (status) {
      case ReceiptPaymentStatus.DRAFT:
        return {
          label: "Nháp",
          className: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
        };
      case ReceiptPaymentStatus.PAID:
        return {
          label: "Đã chi",
          className: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300",
        };
      case ReceiptPaymentStatus.DEBT_PAYMENT:
        return {
          label: "Nợ chi",
          className: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300",
        };
      case ReceiptPaymentStatus.CANCELLED:
        return {
          label: "Đã hủy",
          className: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
        };
      default:
        return {
          label: "Không xác định",
          className: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default PaymentStatusBadge;