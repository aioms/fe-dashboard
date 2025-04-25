import { FC, memo, useCallback, useEffect, useState } from "react";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { formatMoneyWithVND } from "helpers/utils";
import { getDeadInventoryProducts } from "apis/inventory";
import { PaginationState } from "@tanstack/react-table";

interface DeadInventoryProduct {
  id: string;
  productName: string;
  currentInventory: number;
  currentValueInventory: number;
  deadStockRatio: number;
}

interface PaginationMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export const DeadProductInventory: FC = memo(() => {
  const [products, setProducts] = useState<DeadInventoryProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const currentMonth = (new Date().getMonth() + 1).toString();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationMetadata>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });

  const [paginationData, setPaginationData] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Tháng ${i + 1}`,
  }));

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDeadInventoryProducts({
        month: selectedMonth,
        page: paginationData.pageIndex + 1,
        limit: paginationData.pageSize,
      });

      setProducts(response.data);
      // Assuming your API returns pagination metadata
      setPagination(response.metadata);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, paginationData]);

  useEffect(() => {
    if (selectedMonth) {
      fetchData();
    }
  }, [fetchData, selectedMonth]);

  const getDeadStockColor = (ratio: number) => {
    return ratio > 10
      ? "text-red-500 dark:text-red-400"
      : "text-green-500 dark:text-green-400";
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin size-6 border-2 border-slate-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="size-5 text-custom-500" />
              <h6 className="text-15">Danh sách hàng tồn đọng</h6>
            </div>

            <div className="w-52">
              <select
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-slate-500 dark:text-zink-200">
              Không có dữ liệu
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 dark:bg-zink-600">
                    <tr>
                      <th className="p-3 text-left font-semibold text-slate-500 dark:text-zink-200">
                        Tên sản phẩm
                      </th>
                      <th className="p-3 text-right font-semibold text-slate-500 dark:text-zink-200">
                        Tồn kho
                      </th>
                      <th className="p-3 text-right font-semibold text-slate-500 dark:text-zink-200">
                        Giá trị tồn kho
                      </th>
                      <th className="p-3 text-right font-semibold text-slate-500 dark:text-zink-200">
                        Tỷ lệ tồn đọng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-slate-200 dark:border-zink-500 hover:bg-slate-50 dark:hover:bg-zink-600 transition-all duration-300 ease-in-out"
                      >
                        <td className="p-3 text-slate-700 dark:text-zink-100">
                          {product.productName}
                        </td>
                        <td className="p-3 text-right text-slate-700 dark:text-zink-100">
                          {product.currentInventory.toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-slate-700 dark:text-zink-100">
                          {formatMoneyWithVND(product.currentValueInventory)}
                        </td>
                        <td
                          className={`p-3 text-right font-medium ${getDeadStockColor(
                            product.deadStockRatio
                          )}`}
                        >
                          {product.deadStockRatio.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row">
                <div className="grow">
                  <div className="text-slate-500 dark:text-zink-200">
                    Hiển thị <b>{paginationData.pageSize}</b> của{" "}
                    <b>{pagination.totalItems}</b> kết quả
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-100 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 ${
                      paginationData.pageIndex === 0
                        ? "disabled:text-slate-400 dark:disabled:text-zink-300 disabled:cursor-auto"
                        : ""
                    }`}
                    onClick={() =>
                      setPaginationData((prev) => ({
                        ...prev,
                        pageIndex: prev.pageIndex - 1,
                      }))
                    }
                    disabled={paginationData.pageIndex === 0}
                  >
                    <ChevronLeft className="size-4 mr-1 rtl:rotate-180" /> Trang
                    trước
                  </button>
                  <button
                    className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-100 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 ${
                      paginationData.pageIndex === pagination.totalPages - 1
                        ? "disabled:text-slate-400 dark:disabled:text-zink-300 disabled:cursor-auto"
                        : ""
                    }`}
                    onClick={() =>
                      setPaginationData((prev) => ({
                        ...prev,
                        pageIndex: prev.pageIndex + 1,
                      }))
                    }
                    disabled={
                      paginationData.pageIndex === pagination.totalPages - 1
                    }
                  >
                    Trang sau{" "}
                    <ChevronRight className="size-4 ml-1 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

DeadProductInventory.displayName = "DeadProductInventory";

export default DeadProductInventory;
