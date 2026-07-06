import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";

import { request } from "helpers/axios";
import { formatDateTime, formatMoney } from "helpers/utils";
import { IHttpResponse } from "types";
import { NoTableResult } from "Common/Components/NoTableResult";
import type {
  IPriceLog,
  IPriceLogsQueryParams,
  ProductPriceType,
} from "../index.d";

interface PriceHistoryProps {
  productId: string;
}

const PRICE_TYPE = {
  COST_PRICE: "cost_price",
  SELLING_PRICE: "selling_price",
  RETAIL_PRICE: "retail_price",
} as const;

const priceTypeOptions: Array<{ value: "" | ProductPriceType; label: string }> = [
  { value: "", label: "Tất cả" },
  { value: PRICE_TYPE.COST_PRICE, label: "Giá vốn" },
  { value: PRICE_TYPE.SELLING_PRICE, label: "Giá sỉ" },
  { value: PRICE_TYPE.RETAIL_PRICE, label: "Giá lẻ" },
];

const getPriceTypeLabel = (priceType: ProductPriceType) => {
  switch (priceType) {
    case PRICE_TYPE.COST_PRICE:
      return "Giá vốn";
    case PRICE_TYPE.SELLING_PRICE:
      return "Giá sỉ";
    case PRICE_TYPE.RETAIL_PRICE:
      return "Giá lẻ";
    default:
      return priceType;
  }
};

const getPriceTypeBadge = (priceType: ProductPriceType) => {
  const baseClasses =
    "px-2.5 py-0.5 inline-block text-xs font-medium rounded border";

  switch (priceType) {
    case PRICE_TYPE.COST_PRICE:
      return `${baseClasses} bg-amber-100 border-transparent text-amber-600 dark:bg-amber-500/20 dark:border-transparent`;
    case PRICE_TYPE.SELLING_PRICE:
      return `${baseClasses} bg-sky-100 border-transparent text-sky-600 dark:bg-sky-500/20 dark:border-transparent`;
    case PRICE_TYPE.RETAIL_PRICE:
      return `${baseClasses} bg-emerald-100 border-transparent text-emerald-600 dark:bg-emerald-500/20 dark:border-transparent`;
    default:
      return `${baseClasses} bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20 dark:text-zink-200`;
  }
};

const formatPrice = (amount: number) => {
  if (amount === 0) return "0";
  return formatMoney(amount);
};

const PriceHistory: React.FC<PriceHistoryProps> = ({ productId }) => {
  const [logs, setLogs] = useState<IPriceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    priceType: "" as "" | ProductPriceType,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
  });
  const [sorting, setSorting] = useState({
    field: "createdAt",
    order: "desc" as "asc" | "desc",
  });

  const fetchPriceLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: IPriceLogsQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortField: sorting.field,
        sortOrder: sorting.order,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        priceType: filters.priceType || undefined,
      };

      const response: IHttpResponse = await request.get(
        `/products/${productId}/price-logs`,
        { params },
      );

      if (response.success) {
        const metadata = response.metadata;

        setLogs(response.data as IPriceLog[]);
        setPagination({
          page: metadata.currentPage,
          limit: metadata.limit,
          totalItems: metadata.totalItems,
          totalPages: metadata.totalPages,
          currentPage: metadata.currentPage,
          hasNext: metadata.hasNext,
          hasPrevious: metadata.hasPrevious,
        });
      } else {
        throw new Error(response.message || "Failed to fetch price logs");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load price history";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    productId,
    pagination.page,
    pagination.limit,
    sorting.field,
    sorting.order,
    filters.startDate,
    filters.endDate,
    filters.priceType,
  ]);

  useEffect(() => {
    fetchPriceLogs();
  }, [fetchPriceLogs]);

  const resetToFirstPage = () => {
    setPagination((prev) => ({ ...prev, page: 1, currentPage: 1 }));
  };

  const handleFilterChange = (
    field: "startDate" | "endDate" | "priceType",
    value: string,
  ) => {
    setFilters((prev) => {
      if (field === "priceType") {
        return { ...prev, priceType: value as "" | ProductPriceType };
      }

      return { ...prev, [field]: value };
    });
    resetToFirstPage();
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      priceType: "",
    });
    resetToFirstPage();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: newPage,
        currentPage: newPage,
      }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1,
      currentPage: 1,
    }));
  };

  const handleSort = (field: string) => {
    setSorting((prev) => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc",
    }));
  };

  const getSortIcon = (field: string) => {
    if (sorting.field !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }

    return sorting.order === "desc"
      ? <ArrowUpDown className="w-3 h-3 ml-1 text-custom-500" />
      : (
        <ArrowUpDown className="w-3 h-3 ml-1 text-custom-500 transform rotate-180" />
      );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h5 className="text-lg font-medium">Lịch sử thay đổi giá</h5>
          <div className="h-5 w-24 bg-slate-200 dark:bg-zink-600 animate-pulse rounded" />
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="bg-slate-100 dark:bg-zink-600 h-10 rounded-t animate-pulse" />
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-b border-slate-200 dark:border-zink-500"
              >
                <div className="flex p-4 space-x-4">
                  {[...Array(6)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-slate-200 dark:bg-zink-600 animate-pulse rounded flex-1"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h5 className="text-lg font-medium">Lịch sử thay đổi giá</h5>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">{error}</div>
          <button
            onClick={fetchPriceLogs}
            className="px-4 py-2 bg-custom-500 text-white rounded-md hover:bg-custom-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-4">
        <div className="space-y-3">
          <h5 className="text-lg font-medium">Lịch sử thay đổi giá</h5>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-500">Từ ngày</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-500 dark:bg-zink-700 dark:border-zink-500 dark:text-zink-200"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-500">Đến ngày</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-500 dark:bg-zink-700 dark:border-zink-500 dark:text-zink-200"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-500">Loại giá</label>
              <select
                value={filters.priceType}
                onChange={(e) =>
                  handleFilterChange("priceType", e.target.value)
                }
                className="px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-500 dark:bg-zink-700 dark:border-zink-500 dark:text-zink-200"
              >
                {priceTypeOptions.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-700 dark:bg-zink-700 dark:border-zink-500 dark:text-zink-200 dark:hover:bg-zink-600"
              >
                <RotateCcw className="size-4" />
                Xóa lọc
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">Hiển thị:</label>
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-500 dark:bg-zink-700 dark:border-zink-500 dark:text-zink-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="text-sm text-slate-500">
            Tổng {pagination.totalItems} bản ghi
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="text-left bg-slate-100 dark:bg-zink-600">
            <tr>
              <th className="p-3">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center font-medium hover:text-custom-500 transition-colors"
                >
                  Thời gian
                  {getSortIcon("createdAt")}
                </button>
              </th>
              <th className="p-3">
                <button
                  onClick={() => handleSort("priceType")}
                  className="flex items-center font-medium hover:text-custom-500 transition-colors"
                >
                  Loại giá
                  {getSortIcon("priceType")}
                </button>
              </th>
              <th className="p-3 text-right">Giá cũ</th>
              <th className="p-3 text-right">Giá mới</th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort("priceChange")}
                  className="flex items-center justify-end font-medium hover:text-custom-500 transition-colors w-full"
                >
                  Chênh lệch
                  {getSortIcon("priceChange")}
                </button>
              </th>
              <th className="p-3">Người thực hiện</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-slate-200 dark:border-zink-500 hover:bg-slate-50 dark:hover:bg-zink-700 transition-colors"
                >
                  <td className="p-3">
                    <div className="text-sm font-medium">
                      {formatDateTime(log.createdAt, true)}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={getPriceTypeBadge(log.priceType)}>
                      {getPriceTypeLabel(log.priceType)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-sm">
                      {formatPrice(log.previousPrice)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="font-semibold">
                      {formatPrice(log.newPrice)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`font-medium ${
                        log.priceChange > 0
                          ? "text-green-600"
                          : log.priceChange < 0
                          ? "text-red-600"
                          : "text-slate-600"
                      }`}
                    >
                      {log.priceChange > 0 ? "+" : ""}
                      {formatPrice(log.priceChange)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium">
                        {log.user?.fullname || log.user?.id}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <NoTableResult />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-slate-500">
            Hiển thị {((pagination.currentPage - 1) * pagination.limit) + 1}{" "}
            đến{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalItems,
            )}{" "}
            của {pagination.totalItems} bản ghi
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              className="px-2 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zink-500 dark:hover:bg-zink-700"
              title="Trang đầu"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-2 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zink-500 dark:hover:bg-zink-700"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (
                    pagination.currentPage >= pagination.totalPages - 2
                  ) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                        pagination.currentPage === pageNum
                          ? "bg-custom-500 text-white border-custom-500"
                          : "border-slate-200 hover:bg-slate-50 dark:border-zink-500 dark:hover:bg-zink-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                },
              )}
            </div>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-2 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zink-500 dark:hover:bg-zink-700"
              title="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-2 py-1 text-sm border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zink-500 dark:hover:bg-zink-700"
              title="Trang cuối"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceHistory;
