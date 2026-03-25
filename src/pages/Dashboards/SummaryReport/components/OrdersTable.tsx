import React, { useState } from "react";
import { ChevronDown, ChevronRight, ShoppingBag } from "lucide-react";
import { OrderDetail } from "../types";

interface OrdersTableProps {
  orders: OrderDetail[];
  onStatusChange?: (status: string) => void;
  onTypeChange?: (type: string) => void;
}

const OrdersTable = ({ orders, onStatusChange, onTypeChange }: OrdersTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("sales");

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    if (onStatusChange) {
      onStatusChange(value);
    }
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTypeFilter(value);
    if (onTypeChange) {
      onTypeChange(value);
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

  const calculateTotalProfit = (order: OrderDetail) => {
    return order.items.reduce((acc, item) => acc + (item.price - item.costPrice) * item.quantity, 0);
  };

  const totalAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalProfit = orders.reduce((acc, order) => acc + calculateTotalProfit(order), 0);

  return (
    <div className="bg-white dark:bg-zink-700 rounded-lg shadow-sm border border-gray-100 dark:border-zink-600 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-zink-600 flex items-center justify-between">
        <div className="flex items-center">
          <ShoppingBag className="text-primary mr-2" size={20} />
          <h5 className="text-gray-800 dark:text-zink-50 font-bold mb-0 text-base">Đơn hàng trong ngày</h5>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-zink-400">Loại:</span>
            <select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="text-sm border-gray-200 dark:border-zink-600 dark:bg-zink-700 dark:text-zink-100 rounded p-1.5 focus:ring-0 focus:border-blue-500 outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="sales">Bán hàng</option>
              <option value="internal_transfer">Điều chuyển nội bộ</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-zink-400">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="text-sm border-gray-200 dark:border-zink-600 dark:bg-zink-700 dark:text-zink-100 rounded p-1.5 focus:ring-0 focus:border-blue-500 outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="draft">Bản nháp</option>
              <option value="pending">Chờ xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-zink-600/50 text-gray-500 dark:text-zink-200 text-sm uppercase font-bold tracking-wider">
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Mã Đơn hàng</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Phương thức</th>
              <th className="px-4 py-3 text-right">Lợi nhuận</th>
              <th className="px-4 py-3 text-right">Tổng cộng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zink-600">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr 
                  className="hover:bg-gray-50 dark:hover:bg-zink-600/30 transition-colors cursor-pointer"
                  onClick={() => toggleRow(order.id)}
                >
                  <td className="px-4 py-4 text-center">
                    {order.items.length > 0 && (
                      expandedRows[order.id] ? (
                        <ChevronDown size={18} className="text-gray-400 dark:text-zink-400" />
                      ) : (
                        <ChevronRight size={18} className="text-gray-400 dark:text-zink-400" />
                      )
                    )}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800 dark:text-zink-100 text-base">{order.code}</td>
                  <td className="px-4 py-4 text-gray-500 dark:text-zink-400 text-sm">
                    {order.type === 'sales' ? 'Bán hàng' : 'Điều chuyển'}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400'
                    }`}>
                      {order.status === 'completed' ? 'Hoàn thành' :
                       order.status === 'pending' ? 'Chờ xử lý' :
                       order.status === 'draft' ? 'Bản nháp' :
                       order.status === 'cancelled' ? 'Đã hủy' : order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-zink-400 text-base">{order.paymentMethod}</td>
                  <td className="px-4 py-4 text-right text-green-600 dark:text-green-400 font-medium text-base">
                    {formatCurrency(calculateTotalProfit(order))}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-zink-50 text-base">
                    {formatCurrency(order.totalAmount)}
                  </td>
                </tr>
                {expandedRows[order.id] && order.items.length > 0 && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 dark:bg-zink-800/30 px-4 py-0">
                      <div className="py-4 pl-12 pr-4">
                        <table className="w-full text-base">
                          <thead>
                            <tr className="text-gray-400 dark:text-zink-400 border-b border-gray-200 dark:border-zink-600">
                              <th className="pb-3 text-left font-semibold">Sản phẩm</th>
                              <th className="pb-3 text-right font-semibold">Số lượng</th>
                              <th className="pb-3 text-right font-semibold">Giá bán</th>
                              <th className="pb-3 text-right font-semibold">Giá vốn</th>
                              <th className="pb-3 text-right font-semibold">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-zink-600">
                            {order.items.map((item, idx) => (
                              <tr key={`${order.id}-item-${idx}`}>
                                <td className="py-3 text-gray-600 dark:text-zink-300">
                                  {item.productName} <br/>
                                  <span className="text-sm text-gray-400">{item.code}</span>
                                </td>
                                <td className="py-3 text-right text-gray-600 dark:text-zink-300">{item.quantity}</td>
                                <td className="py-3 text-right text-gray-600 dark:text-zink-300">{formatCurrency(item.price)}</td>
                                <td className="py-3 text-right text-gray-600 dark:text-zink-300">{formatCurrency(item.costPrice)}</td>
                                <td className="py-3 text-right text-gray-800 dark:text-zink-100">{formatCurrency(item.price * item.quantity)}</td>
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
              <td colSpan={5} className="px-4 py-5 text-right font-bold text-gray-600 dark:text-zink-200 text-base">Tổng cộng hôm nay:</td>
              <td className="px-4 py-5 text-right font-extrabold text-green-600 dark:text-green-400 text-xl">
                {formatCurrency(totalProfit)}
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

export default OrdersTable;
