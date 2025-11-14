import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from "lucide-react";
import { toast } from "react-toastify";
import { request } from "helpers/axios";
import { formatMoney, formatNumberWithSeparator, formatDateTime } from "helpers/utils";
import { IHttpResponse } from "types";
import { NoTableResult } from "Common/Components/NoTableResult";
import { getChangeTypeBadge, getChangeTypeLabel, getReferenceLink } from "../utils/product.util";
import type { IInventoryLog, IInventoryLogsQueryParams } from "../index.d";

interface InventoryHistoryProps {
  productId: string;
}

const InventoryHistory: React.FC<InventoryHistoryProps> = ({ productId }) => {
  const [logs, setLogs] = useState<IInventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false
  });
  const [sorting, setSorting] = useState({
    field: "createdAt",
    order: "desc" as "asc" | "desc"
  });

  const fetchInventoryLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: IInventoryLogsQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortField: sorting.field,
        sortOrder: sorting.order
      };

      const response: IHttpResponse = await request.get(
        `/products/${productId}/inventory-logs`,
        { params }
      );

      if (response.success) {
        const data = response.data as IInventoryLog[];
        const metadata = response.metadata;
        setLogs(data);
        setPagination({
          page: metadata.currentPage,
          limit: metadata.limit,
          totalItems: metadata.totalItems,
          totalPages: metadata.totalPages,
          currentPage: metadata.currentPage,
          hasNext: metadata.hasNext,
          hasPrevious: metadata.hasPrevious
        });
      } else {
        throw new Error(response.message || "Failed to fetch inventory logs");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load inventory history";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryLogs();
  }, [productId, pagination.currentPage, pagination.limit, sorting.field, sorting.order]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage, currentPage: newPage }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: newLimit, 
      page: 1 // Reset to first page when changing limit
    }));
  };

  const handleSort = (field: string) => {
    setSorting(prev => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc"
    }));
  };

  const getSortIcon = (field: string) => {
    if (sorting.field !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sorting.order === "desc" 
      ? <ArrowUpDown className="w-3 h-3 ml-1 text-custom-500" />
      : <ArrowUpDown className="w-3 h-3 ml-1 text-custom-500 transform rotate-180" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h5 className="text-lg font-medium">Lịch sử thay đổi tồn kho</h5>
          <div className="h-5 w-24 bg-slate-200 dark:bg-zink-600 animate-pulse rounded"></div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="bg-slate-100 dark:bg-zink-600 h-10 rounded-t animate-pulse"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-slate-200 dark:border-zink-500">
                <div className="flex p-4 space-x-4">
                  {[...Array(10)].map((_, j) => (
                    <div key={j} className="h-4 bg-slate-200 dark:bg-zink-600 animate-pulse rounded flex-1"></div>
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
          <h5 className="text-lg font-medium">Lịch sử thay đổi tồn kho</h5>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">{error}</div>
          <button
            onClick={fetchInventoryLogs}
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h5 className="text-lg font-medium">Lịch sử thay đổi tồn kho</h5>
        <div className="flex flex-col sm:flex-row gap-3">
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
              <option value={100}>100</option>
            </select>
          </div>
          <div className="text-sm text-slate-500">
             Tổng {pagination.totalItems} bản ghi
           </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
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
                  onClick={() => handleSort("changeType")}
                  className="flex items-center font-medium hover:text-custom-500 transition-colors"
                >
                  Loại thay đổi
                  {getSortIcon("changeType")}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort("previousInventory")}
                  className="flex items-center justify-end font-medium hover:text-custom-500 transition-colors w-full"
                >
                  Tồn kho trước
                  {getSortIcon("previousInventory")}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort("inventoryChange")}
                  className="flex items-center justify-end font-medium hover:text-custom-500 transition-colors w-full"
                >
                  Thay đổi
                  {getSortIcon("inventoryChange")}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort("currentInventory")}
                  className="flex items-center justify-end font-medium hover:text-custom-500 transition-colors w-full"
                >
                  Tồn kho hiện tại
                  {getSortIcon("currentInventory")}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort("previousCostPrice")}
                  className="flex items-center justify-end font-medium hover:text-custom-500 transition-colors w-full"
                >
                  Giá vốn trước
                  {getSortIcon("previousCostPrice")}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort("costPriceChange")}
                  className="flex items-center justify-end font-medium hover:text-custom-500 transition-colors w-full"
                >
                  Thay đổi giá
                  {getSortIcon("costPriceChange")}
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort("currentCostPrice")}
                  className="flex items-center justify-end font-medium hover:text-custom-500 transition-colors w-full"
                >
                  Giá vốn hiện tại
                  {getSortIcon("currentCostPrice")}
                </button>
              </th>
              <th className="p-3">
                <button
                  onClick={() => handleSort("userId")}
                  className="flex items-center font-medium hover:text-custom-500 transition-colors"
                >
                  Người thực hiện
                  {getSortIcon("userId")}
                </button>
              </th>
              <th className="p-3">
                <button
                  onClick={() => handleSort("referenceId")}
                  className="flex items-center font-medium hover:text-custom-500 transition-colors"
                >
                  Mã tham chiếu
                  {getSortIcon("referenceId")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-200 dark:border-zink-500 hover:bg-slate-50 dark:hover:bg-zink-700 transition-colors">
                  <td className="p-3">
                    <div className="text-sm font-medium">
                      {formatDateTime(log.createdAt)}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={getChangeTypeBadge(log.changeType)}>
                      {getChangeTypeLabel(log.changeType)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-sm">
                      {formatNumberWithSeparator(log.previousInventory)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`font-medium ${
                      log.inventoryChange > 0 ? "text-green-600" : 
                      log.inventoryChange < 0 ? "text-red-600" : "text-slate-600"
                    }`}>
                      {log.inventoryChange > 0 ? "+" : ""}{formatNumberWithSeparator(log.inventoryChange)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="font-semibold">
                      {formatNumberWithSeparator(log.currentInventory)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-sm">
                      {formatMoney(log.previousCostPrice)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`font-medium ${
                      log.costPriceChange > 0 ? "text-green-600" : 
                      log.costPriceChange < 0 ? "text-red-600" : "text-slate-600"
                    }`}>
                      {log.costPriceChange > 0 ? "+" : ""}{formatMoney(log.costPriceChange)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="font-semibold">
                      {formatMoney(log.currentCostPrice)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium">{log.user?.fullname || log.user?.id}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    {log.referenceId ? (
                      (() => {
                        const link = getReferenceLink(log.referenceId, log.changeType);
                        return link ? (
                          <Link 
                            to={link} 
                            className="text-custom-500 font-medium text-sm hover:text-custom-600 hover:underline transition-colors"
                          >
                            {log.referenceId}
                          </Link>
                        ) : (
                          <span className="text-custom-500 font-medium text-sm">
                            {log.referenceId}
                          </span>
                        );
                      })()
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>
                  <NoTableResult />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-slate-500">
             Hiển thị {((pagination.currentPage - 1) * pagination.limit) + 1} đến {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} của {pagination.totalItems} bản ghi
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
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
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
              })}
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

export default InventoryHistory;