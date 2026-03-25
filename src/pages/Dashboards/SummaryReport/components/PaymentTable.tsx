import React, { useState } from "react";
import { ChevronDown, ChevronRight, CreditCard } from "lucide-react";
import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPE_OPTIONS } from "Common/constants/receipt-constant";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: number;
  processedAt: string;
  paymentMethod: number;
}

interface Payment {
  id: string;
  method: string;
  status: number;
  type: number;
  total: number;
  collectedAmount: number;
  outstandingAmount: number;
  transactions: Transaction[];
}

interface PaymentTableProps {
  payments: Payment[];
  onStatusChange?: (status: string) => void;
  onTypeChange?: (type: string) => void;
  selectedStatus?: string;
  selectedType?: string;
}

const PaymentTable = ({
  payments,
  onStatusChange,
  onTypeChange,
  selectedStatus = "all",
  selectedType = "all"
}: PaymentTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getPaymentStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">Đã thanh toán</span>;
      case 1:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">Thanh toán một phần</span>;
      case 2:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">Đã hủy</span>;
      default:
        return null;
    }
  };

  const getPaymentTypeLabel = (type: number) => {
    return type === 1 ? "Đơn hàng" : "Công nợ";
  };

  const getTransactionStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400">Chờ</span>;
      case 2:
        return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">Thành công</span>;
      case 3:
        return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">Thất bại</span>;
      default:
        return null;
    }
  };

  const getMethodLabel = (method: number) => {
    switch (method) {
      case 1: return "Tiền mặt";
      case 2: return "Chuyển khoản";
      case 3: return "Thẻ tín dụng";
      default: return "Khác";
    }
  };

  return (
    <div className="bg-white dark:bg-zink-700 rounded-lg shadow-sm border border-gray-100 dark:border-zink-600 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-zink-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <CreditCard className="text-blue-500 mr-2" size={24} />
          <h5 className="text-gray-800 dark:text-zink-50 font-bold mb-0 text-base">Danh sách Thanh toán và Giao dịch phụ hôm nay</h5>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange?.(e.target.value)}
            className="text-sm border-gray-200 dark:border-zink-600 dark:bg-zink-700 dark:text-zink-100 rounded p-1.5 focus:ring-0 focus:border-blue-500 outline-none"
          >
            {PAYMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange?.(e.target.value)}
            className="text-sm border-gray-200 dark:border-zink-600 dark:bg-zink-700 dark:text-zink-100 rounded p-1.5 focus:ring-0 focus:border-blue-500 outline-none"
          >
            {PAYMENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-zink-600/50 text-gray-500 dark:text-zink-200 text-sm uppercase font-bold tracking-wider">
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3 text-right">Đã thu</th>
              <th className="px-4 py-3 text-right">Còn lại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zink-600">
            {payments.map((payment) => (
              <React.Fragment key={payment.id}>
                <tr
                  className="hover:bg-gray-50 dark:hover:bg-zink-600/30 transition-colors cursor-pointer"
                  onClick={() => toggleRow(payment.id)}
                >
                  <td className="px-4 py-4 text-center">
                    {payment.transactions.length > 0 && (
                      expandedRows[payment.id] ? (
                        <ChevronDown size={18} className="text-gray-400 dark:text-zink-400" />
                      ) : (
                        <ChevronRight size={18} className="text-gray-400 dark:text-zink-400" />
                      )
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-gray-800 dark:text-zink-100">{payment.id}</td>
                  <td className="px-4 py-4 text-gray-500 dark:text-zink-400 text-sm">
                    {getPaymentTypeLabel(payment.type)}
                  </td>
                  <td className="px-4 py-4">
                    {getPaymentStatusBadge(payment.status)}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-zink-50 text-base">
                    {formatCurrency(payment.total)}
                  </td>
                  <td className="px-4 py-4 text-right text-green-600 dark:text-green-400 text-base">
                    {formatCurrency(payment.collectedAmount)}
                  </td>
                  <td className="px-4 py-4 text-right text-red-600 dark:text-red-400 text-base">
                    {formatCurrency(payment.outstandingAmount)}
                  </td>
                </tr>
                {expandedRows[payment.id] && payment.transactions.length > 0 && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 dark:bg-zink-800/30 px-4 py-0">
                      <div className="py-4 pl-12 pr-4">
                        <table className="w-full text-base">
                          <thead>
                            <tr className="text-gray-400 dark:text-zink-400 border-b border-gray-200 dark:border-zink-600">
                              <th className="pb-3 text-left font-semibold">Mã Giao dịch</th>
                              <th className="pb-3 text-left font-semibold">Mô tả</th>
                              <th className="pb-3 text-left font-semibold">Phương thức</th>
                              <th className="pb-3 text-center font-semibold">Trạng thái</th>
                              <th className="pb-3 text-center font-semibold">Thời gian</th>
                              <th className="pb-3 text-right font-semibold">Số tiền</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-zink-600">
                            {payment.transactions.map((txn) => (
                              <tr key={txn.id}>
                                <td className="py-3 text-gray-600 dark:text-zink-300 font-mono text-sm">{txn.id}</td>
                                <td className="py-3 text-gray-600 dark:text-zink-300">{txn.description}</td>
                                <td className="py-3 text-gray-600 dark:text-zink-300 text-sm">
                                  {getMethodLabel(txn.paymentMethod)}
                                </td>
                                <td className="py-3 text-center">
                                  {getTransactionStatusBadge(txn.status)}
                                </td>
                                <td className="py-3 text-center text-gray-400 dark:text-zink-400 text-sm">
                                  {txn.processedAt ? new Date(txn.processedAt).toLocaleString("vi-VN") : "-"}
                                </td>
                                <td className="py-3 text-right text-gray-800 dark:text-zink-100 font-medium text-base">{formatCurrency(txn.amount)}</td>
                              </tr>
                            ))}
                            <tr className="bg-blue-50/50 dark:bg-blue-500/5 font-bold">
                              <td colSpan={5} className="py-3 text-right text-gray-600 dark:text-zink-200">Tổng giao dịch:</td>
                              <td className="py-3 text-right text-blue-600 dark:text-blue-400">
                                {formatCurrency(payment.transactions.reduce((acc, txn) => acc + txn.amount, 0))}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 dark:bg-zink-600/50">
              <td colSpan={4} className="px-4 py-5 text-right font-bold text-gray-600 dark:text-zink-200 text-base">Tổng cộng:</td>
              <td className="px-4 py-5 text-right font-extrabold text-blue-600 dark:text-blue-400 text-xl">
                {formatCurrency(payments.reduce((acc, curr) => acc + curr.total, 0))}
              </td>
              <td className="px-4 py-5 text-right font-extrabold text-green-600 dark:text-green-400 text-xl">
                {formatCurrency(payments.reduce((acc, curr) => acc + curr.collectedAmount, 0))}
              </td>
              <td className="px-4 py-5 text-right font-extrabold text-red-600 dark:text-red-400 text-xl">
                {formatCurrency(payments.reduce((acc, curr) => acc + curr.outstandingAmount, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
