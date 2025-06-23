import { useState } from "react";
import type { ISalesOrder } from "../index.d";
import { formatMoney } from "helpers/utils";

const SalesHistory: React.FC<{ orders: ISalesOrder[] }> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderCode
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // Add date filtering logic here
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-zink-50">
          Lịch sử bán hàng
        </h3>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng"
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="date"
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-100 dark:bg-zink-600">
            <tr>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Mã đơn hàng
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Ngày tạo
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Loại giao dịch
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Số lượng SP
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Tổng tiền
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50 dark:hover:bg-zink-600"
              >
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  <button className="text-custom-500 hover:text-custom-600 font-medium">
                    {order.orderCode}
                  </button>
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded ${
                      order.transactionType === "sale"
                        ? "bg-green-100 text-green-500 dark:bg-green-500/20"
                        : "bg-red-100 text-red-500 dark:bg-red-500/20"
                    }`}
                  >
                    {order.transactionType === "sale" ? "Bán hàng" : "Trả hàng"}
                  </span>
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  {order.quantity}
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  <span
                    className={
                      order.transactionType === "return" ? "text-red-500" : ""
                    }
                  >
                    {order.transactionType === "return" ? "-" : ""}
                    {formatMoney(order.totalAmount)}đ
                  </span>
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-500 dark:bg-green-500/20">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesHistory;