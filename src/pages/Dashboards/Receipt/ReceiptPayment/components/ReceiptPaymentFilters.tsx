import React from "react";
import { TimePicker } from "Common/Components/TimePIcker";
import { getDate } from "helpers/date";
import {
  ReceiptPaymentFilterDto,
  ReceiptPaymentExpenseType,
  ReceiptPaymentStatus
} from "types/receiptPayment";

interface ReceiptPaymentFiltersProps {
  filters: ReceiptPaymentFilterDto;
  setFilters: React.Dispatch<React.SetStateAction<ReceiptPaymentFilterDto>>;
}

const expenseTypeOptions = [
  { value: "", label: "Tất cả loại chi phí" },
  { value: ReceiptPaymentExpenseType.SUPPLIER_PAYMENT, label: "Chi tiền hàng NCC" },
  { value: ReceiptPaymentExpenseType.TRANSPORTATION, label: "Vận chuyển" },
  { value: ReceiptPaymentExpenseType.UTILITIES, label: "Tiện ích" },
  { value: ReceiptPaymentExpenseType.RENT, label: "Thuê mặt bằng" },
  { value: ReceiptPaymentExpenseType.LABOR, label: "Nhân công" },
  { value: ReceiptPaymentExpenseType.OTHER, label: "Khác" },
];

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: ReceiptPaymentStatus.DRAFT, label: "Nháp" },
  { value: ReceiptPaymentStatus.PAID, label: "Đã chi" },
  { value: ReceiptPaymentStatus.DEBT_PAYMENT, label: "Nợ chi" },
  { value: ReceiptPaymentStatus.CANCELLED, label: "Đã hủy" },
];

const ReceiptPaymentFilters: React.FC<ReceiptPaymentFiltersProps> = ({
  filters,
  setFilters,
}) => {
  const handleFilterChange = (key: keyof ReceiptPaymentFilterDto, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Date Range */}
      <div>
        <TimePicker
          value={filters.startDate as string}
          onChange={([date]) => {
            handleFilterChange('startDate', date ? getDate(date).toISOString() : '');
          }}
          props={{
            placeholder: "Từ ngày",
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
            placeholder: "Đến ngày",
            id: "endDate",
          }}
        />
      </div>

      {/* Expense Type Filter */}
      <div>
        <select
          className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
          value={filters.expenseType || ""}
          onChange={(e) => handleFilterChange('expenseType', e.target.value)}
        >
          {expenseTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
    </div>
  );
};

export default ReceiptPaymentFilters;