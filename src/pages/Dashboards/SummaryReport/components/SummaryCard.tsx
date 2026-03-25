import React from "react";
import CountUp from "react-countup";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  icon: LucideIcon;
  iconClass: string;
  items: {
    label: string;
    value: number;
    isCurrency?: boolean;
    suffix?: string;
  }[];
  showStatusFilter?: boolean;
  onStatusChange?: (status: string) => void;
  statusOptions?: { label: string; value: string }[];
  value?: string;
}

const SummaryCard = ({
  title,
  icon: Icon,
  iconClass,
  items,
  showStatusFilter,
  onStatusChange,
  value,
  statusOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Đã hoàn thành", value: "completed" },
    { label: "Đang xử lý", value: "pending" },
    { label: "Đã hủy", value: "cancelled" },
  ]
}: SummaryCardProps) => {

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (onStatusChange) {
      onStatusChange(newValue);
    }
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Map iconClass to Tailwind colors with dark mode support
  const colorMap: Record<string, string> = {
    primary: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    success: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
    danger: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    info: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
    secondary: "bg-gray-100 text-gray-600 dark:bg-zink-600 dark:text-zink-200",
  };

  const colorClasses = colorMap[iconClass] || colorMap.primary;

  return (
    <div className="bg-white dark:bg-zink-700 rounded-lg shadow-sm border border-gray-100 dark:border-zink-600 p-4 h-full hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center mb-4">
        <div className={`w-14 h-14 flex items-center justify-center rounded-lg ${colorClasses}`}>
          <Icon size={28} />
        </div>
        <div className="flex-grow-1 ms-3 flex justify-between items-center w-full">
          <h5 className="text-gray-500 dark:text-zink-200 uppercase text-sm font-bold tracking-wider mb-0">{title}</h5>
          {showStatusFilter && (
            <select
              value={value ?? "all"}
              onChange={handleStatusChange}
              className="text-sm border-gray-200 dark:border-zink-600 dark:bg-zink-700 dark:text-zink-100 rounded p-1.5 focus:ring-0 focus:border-blue-500 outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <p className="text-gray-600 dark:text-zink-300 text-base mb-0">{item.label}:</p>
            <h4 className="text-xl font-bold text-gray-800 dark:text-zink-50 mb-0">
              {item.isCurrency ? (
                formatCurrency(item.value)
              ) : (
                <div className="flex items-baseline">
                  <CountUp end={item.value} separator="," />
                  {item.suffix && <span className="ml-1 text-sm text-gray-400 dark:text-zink-400 font-normal">{item.suffix}</span>}
                </div>
              )}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
