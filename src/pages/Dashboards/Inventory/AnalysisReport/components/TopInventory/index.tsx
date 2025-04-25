import { FC, useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "react-toastify";
import { formatMoneyWithVND } from "helpers/utils";
import { getTopInventoryProducts } from "apis/inventory";

interface TopInventoryProduct {
  id: string;
  productName: string;
  inventory: number;
  inventoryValue: number;
}

export enum TopStockSortBy {
  INVENTORY = "inventory",
  VALUE = "value",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

interface SortConfig {
  sortBy: TopStockSortBy;
  sortOrder: SortOrder;
}

export const TopInventory: FC = () => {
  const [products, setProducts] = useState<TopInventoryProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: TopStockSortBy.INVENTORY,
    sortOrder: SortOrder.DESC,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTopInventoryProducts({
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      });
      setProducts(response.data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [sortConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (sortBy: TopStockSortBy) => {
    setSortConfig((prev) => ({
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === SortOrder.DESC
          ? SortOrder.ASC
          : SortOrder.DESC,
    }));
  };

  const SortButton: FC<{ sortBy: TopStockSortBy; label: string }> = ({
    sortBy,
    label,
  }) => (
    <button
      onClick={() => handleSort(sortBy)}
      className={`flex items-center gap-1 px-4 py-2 rounded-md transition-all duration-200 ${
        sortConfig.sortBy === sortBy
          ? "bg-custom-500 text-white"
          : "bg-slate-100 dark:bg-zink-600 text-slate-700 dark:text-zink-100 hover:bg-slate-200 dark:hover:bg-zink-500"
      }`}
    >
      {label}
      {sortConfig.sortBy === sortBy &&
        (sortConfig.sortOrder === SortOrder.DESC ? (
          <ArrowDown className="size-4" />
        ) : (
          <ArrowUp className="size-4" />
        ))}
    </button>
  );

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
            <h6 className="text-15">Thống kê 10 hàng hóa tồn kho </h6>
            <div className="flex gap-2">
              <SortButton sortBy={TopStockSortBy.INVENTORY} label="Tồn kho" />
              <SortButton sortBy={TopStockSortBy.VALUE} label="Giá trị" />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-slate-500 dark:text-zink-200">
              Không có dữ liệu
            </div>
          ) : (
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
                        {product.inventory.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-slate-700 dark:text-zink-100">
                        {formatMoneyWithVND(product.inventoryValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopInventory;
