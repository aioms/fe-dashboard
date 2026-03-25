import React, { useState } from "react";
import { ChevronDown, ChevronRight, CreditCard } from "lucide-react";
import { ReceiptDebtDetail, ReceiptDebtStatus } from "../types";

interface ReceiptDebtsTableProps {
  receiptDebts: ReceiptDebtDetail[];
  onStatusChange?: (status: string) => void;
}

const ReceiptDebtsTable = ({ receiptDebts, onStatusChange }: ReceiptDebtsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    if (onStatusChange) {
      onStatusChange(value);
    }
  };

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

  const totalAmount = receiptDebts.reduce((acc, debt) => acc + debt.totalAmount, 0);
  const totalPaid = receiptDebts.reduce((acc, debt) => acc + debt.paidAmount, 0);
  const totalRemaining = receiptDebts.reduce((acc, debt) => acc + debt.remainingAmount, 0);

  return (
    <div className="bg-white dark:bg-zink-700 rounded-lg shadow-sm border border-gray-100 dark:border-zink-600 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-zink-600 flex items-center justify-between">
        <div className="flex items-center">
          <CreditCard className="text-danger mr-2" size={20} />
          <h5 className="text-gray-800 dark:text-zink-50 font-bold mb-0 text-base">Công nợ trong ngày</h5>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-zink-400">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="text-sm border-gray-200 dark:border-zink-600 dark:bg-zink-700 dark:text-zink-100 rounded p-1.5 focus:ring-0 focus:border-blue-500 outline-none"
          >
            <option value="all">Tất cả</option>
            <option value={ReceiptDebtStatus.PENDING}>Chưa thanh toán</option>
            <option value={ReceiptDebtStatus.PARTIAL_PAID}>Thanh toán một phần</option>
            <option value={ReceiptDebtStatus.COMPLETED}>Đã hoàn thành</option>
            <option value={ReceiptDebtStatus.CANCELLED}>Đã hủy</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-zink-600/50 text-gray-500 dark:text-zink-200 text-sm uppercase font-bold tracking-wider">
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Mã Công nợ</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Đã thanh toán</th>
              <th className="px-4 py-3 text-right">Còn lại</th>
              <th className="px-4 py-3 text-right">Tổng cộng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zink-600">
            {receiptDebts.map((debt) => (
              <React.Fragment key={debt.id}>
                <tr 
                  className="hover:bg-gray-50 dark:hover:bg-zink-600/30 transition-colors cursor-pointer"
                  onClick={() => toggleRow(debt.id)}
                >
                  <td className="px-4 py-4 text-center">
                    {debt.items.length > 0 && (
                      expandedRows[debt.id] ? (
                        <ChevronDown size={18} className="text-gray-400 dark:text-zink-400" />
                      ) : (
                        <ChevronRight size={18} className="text-gray-400 dark:text-zink-400" />
                      )
                    )}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800 dark:text-zink-100 text-base">{debt.code}</td>
                  <td className="px-4 py-4 text-gray-500 dark:text-zink-400 text-base">
                    {debt.type === 'supplier_debt' ? 'Nợ NCC' : 'Nợ Khách hàng'}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      debt.status === ReceiptDebtStatus.COMPLETED ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                      debt.status === ReceiptDebtStatus.PARTIAL_PAID ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400' :
                      debt.status === ReceiptDebtStatus.PENDING ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400'
                    }`}>
                      {debt.status === ReceiptDebtStatus.COMPLETED ? 'Hoàn thành' :
                       debt.status === ReceiptDebtStatus.PARTIAL_PAID ? 'Thanh toán một phần' :
                       debt.status === ReceiptDebtStatus.PENDING ? 'Chưa thanh toán' :
                       debt.status === ReceiptDebtStatus.CANCELLED ? 'Đã hủy' : debt.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-green-600 dark:text-green-400 font-medium text-base">
                    {formatCurrency(debt.paidAmount)}
                  </td>
                  <td className="px-4 py-4 text-right text-red-600 dark:text-red-400 font-medium text-base">
                    {formatCurrency(debt.remainingAmount)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-zink-50 text-base">
                    {formatCurrency(debt.totalAmount)}
                  </td>
                </tr>
                {expandedRows[debt.id] && debt.items.length > 0 && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 dark:bg-zink-800/30 px-4 py-0">
                      <div className="py-4 pl-12 pr-4">
                        <table className="w-full text-base">
                          <thead>
                            <tr className="text-gray-400 dark:text-zink-400 border-b border-gray-200 dark:border-zink-600">
                              <th className="pb-3 text-left font-semibold">Sản phẩm</th>
                              <th className="pb-3 text-right font-semibold">Số lượng</th>
                              <th className="pb-3 text-right font-semibold">Giá vốn (Lúc nhập)</th>
                              <th className="pb-3 text-right font-semibold">Giá vốn (Hiện tại)</th>
                              <th className="pb-3 text-right font-semibold">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-zink-600">
                            {debt.items.map((item, idx) => (
                              <tr key={`${debt.id}-item-${idx}`}>
                                <td className="py-3 text-gray-600 dark:text-zink-300">
                                  {item.productName} <br/>
                                  <span className="text-sm text-gray-400">{item.productCode}</span>
                                </td>
                                <td className="py-3 text-right text-gray-600 dark:text-zink-300">{item.quantity}</td>
                                <td className="py-3 text-right text-gray-600 dark:text-zink-300">{formatCurrency(item.costPrice)}</td>
                                <td className="py-3 text-right text-gray-600 dark:text-zink-300">{formatCurrency(item.productCostPrice)}</td>
                                <td className="py-3 text-right text-gray-800 dark:text-zink-100">{formatCurrency(item.costPrice * item.quantity)}</td>
                              </tr>
                            ))}
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
              <td colSpan={4} className="px-4 py-5 text-right font-bold text-gray-600 dark:text-zink-200 text-base">Tổng cộng hôm nay:</td>
              <td className="px-4 py-5 text-right font-extrabold text-green-600 dark:text-green-400 text-xl">
                {formatCurrency(totalPaid)}
              </td>
              <td className="px-4 py-5 text-right font-extrabold text-red-600 dark:text-red-400 text-xl">
                {formatCurrency(totalRemaining)}
              </td>
              <td className="px-4 py-5 text-right font-extrabold text-blue-600 dark:text-blue-400 text-xl">
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ReceiptDebtsTable;
