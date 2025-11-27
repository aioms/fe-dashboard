import { useState } from "react";
import type { IDebtRecord } from "../index.d";
import { formatDateTime, formatMoney } from "helpers/utils";

const OutstandingDebt: React.FC<{
  debtRecords: IDebtRecord[];
  totalDebt: number;
}> = ({ debtRecords, totalDebt }) => {
  const [monthFilter, setMonthFilter] = useState("");
  const [quarterFilter, setQuarterFilter] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-zink-50">
            Chi tiết công nợ
          </h3>
          <div className="mt-2">
            <span className="text-sm text-slate-600 dark:text-zink-200">
              Tổng công nợ hiện tại:{" "}
            </span>
            <span
              className={`text-lg font-bold ${
                totalDebt > 0
                  ? "text-red-500"
                  : totalDebt < 0
                  ? "text-green-500"
                  : "text-slate-800 dark:text-zink-50"
              }`}
            >
              {formatMoney(totalDebt)}đ
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <select
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
            value={quarterFilter}
            onChange={(e) => setQuarterFilter(e.target.value)}
          >
            <option value="">Tất cả quý</option>
            <option value="1">Quý 1</option>
            <option value="2">Quý 2</option>
            <option value="3">Quý 3</option>
            <option value="4">Quý 4</option>
          </select>

          <button className="btn bg-green-500 border-green-500 text-white hover:text-white hover:bg-green-600 hover:border-green-600">
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-100 dark:bg-zink-600">
            <tr>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Ngày
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Mã đơn hàng
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Mô tả
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Số tiền (+/-)
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Đã thanh toán
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Còn lại
              </th>
              <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-left">
                Ghi chú
              </th>
            </tr>
          </thead>
          <tbody>
            {debtRecords.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-slate-50 dark:hover:bg-zink-600"
              >
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  {formatDateTime(record.date, true)}
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  <button className="text-custom-500 hover:text-custom-600 font-medium">
                    {record.orderCode}
                  </button>
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  {record.description}
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  <span
                    className={
                      record.amount > 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {record.amount > 0 ? "+" : ""}
                    {formatMoney(record.amount)}đ
                  </span>
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  {record.amountPaid
                    ? `${formatMoney(record.amountPaid)}đ`
                    : "–"}
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  {record.remainingBalance ? (
                    <span className="text-red-500 font-medium">
                      {formatMoney(record.remainingBalance)}đ
                    </span>
                  ) : (
                    "–"
                  )}
                </td>
                <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                  {record.notes || "–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutstandingDebt;
