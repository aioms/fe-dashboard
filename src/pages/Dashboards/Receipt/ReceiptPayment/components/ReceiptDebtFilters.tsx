import React from "react";
import { TimePicker } from "Common/Components/TimePIcker";
import { getDate } from "helpers/date";
import {
  ReceiptDebtFilterDto,
  ReceiptDebtStatus,
  ReceiptDebtType
} from "types/receiptPayment";

interface ReceiptDebtFiltersProps {
  filters: ReceiptDebtFilterDto;
  setFilters: React.Dispatch<React.SetStateAction<ReceiptDebtFilterDto>>;
}

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: ReceiptDebtStatus.PENDING, label: "Chờ thanh toán" },
  { value: ReceiptDebtStatus.PARTIAL_PAID, label: "Đã thu 1 phần" },
  { value: ReceiptDebtStatus.COMPLETED, label: "Hoàn thành" },
  { value: ReceiptDebtStatus.OVERDUE, label: "Trễ hạn" },
];

const typeOptions = [
  { value: "", label: "Tất cả loại nợ" },
  { value: ReceiptDebtType.CUSTOMER_DEBT, label: "Nợ khách hàng" },
  { value: ReceiptDebtType.SUPPLIER_DEBT, label: "Nợ nhà cung cấp" },
];

const ReceiptDebtFilters: React.FC<ReceiptDebtFiltersProps> = ({
  filters,
  setFilters,
}) => {
  const handleFilterChange = (key: keyof ReceiptDebtFilterDto, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Due Date Range */}
      <div>
        <TimePicker
          value={filters.startDate as string}
          onChange={([date]) => {
            handleFilterChange('startDate', date ? getDate(date).toISOString() : '');
          }}
          props={{
            placeholder: "Từ hạn thanh toán",
            id: "startDate",
          }}
        />
      </div>

      <div>
        <TimePicker
          value={filters.endDate as string}
          onChange={([date]) => {
            handleFilterChange('endDate', date ? getDate(date).toISOString() : '');
          }}
          props={{
            placeholder: "Đến hạn thanh toán",
            id: "endDate",
          }}
        />
      </div>

      {/* Status Filter */}
      <div>
        <select
          className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
          value={filters.status || ""}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Type Filter */}
      <div>
        <select
          className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
          value={filters.type || ""}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ReceiptDebtFilters;