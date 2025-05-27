import { FC, useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { toast } from "react-toastify";

import {
  getInventoryByCategory,
  getTotalInventoryByCategory,
} from "apis/inventory";
import { getCategoryList } from "apis/product";

const ITEMS_PER_PAGE = 10;

// Chart options
const options = {
  chart: {
    type: "bar" as const,
    height: 450,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "70%",
      distributed: true,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (value: number) {
      return value.toLocaleString();
    },
    style: {
      fontSize: "12px",
    },
  },
  xaxis: {
    // categories: chartData.products,
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  colors: ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"],
  legend: {
    show: false,
  },
  tooltip: {
    theme: document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
    y: {
      formatter: function (value: number) {
        return value.toLocaleString();
      },
    },
  },
};

interface PaginationMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export const InventoryStatistical: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);

  const [totalCategoryInventory, setTotalCategoryInventory] =
    useState<number>(0);

  const [inventoryData, setInventoryData] = useState<
    { x: string; y: number }[]
  >([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMetadata>({
    currentPage: 1,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchInventoryData = useCallback(async () => {
    if (!selectedCategory?.value) return;

    try {
      const { data, metadata, success } = await getInventoryByCategory({
        category: selectedCategory.value,
        page: paginationMeta.currentPage,
        limit: ITEMS_PER_PAGE,
      });

      if (!success) return;

      setInventoryData(data);
      setPaginationMeta(metadata);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [selectedCategory, paginationMeta.currentPage]);

  // Fetch total inventory for selected category
  const fetchTotalInventory = useCallback(async () => {
    if (!selectedCategory?.value) {
      setTotalCategoryInventory(0);
      return;
    }

    try {
      const total = await getTotalInventoryByCategory(selectedCategory.value);
      setTotalCategoryInventory(total);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [selectedCategory]);

  // Fetch inventory data when category changes
  useEffect(() => {
    fetchInventoryData();
    fetchTotalInventory();
  }, [fetchInventoryData, fetchTotalInventory]);

  useEffect(() => {
    // Load category options
    const loadCategories = async () => {
      try {
        const response = await getCategoryList({});

        if (response && response.data) {
          const options = response.data?.map?.((category: any) => ({
            value: category,
            label: category,
          }));
          setCategoryOptions(options);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryChange = (selected: any) => {
    setSelectedCategory(selected);
    setPaginationMeta((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setPaginationMeta((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h6 className="text-15 grow">Thống kê tồn kho theo danh mục</h6>

          <div className="flex items-center gap-4">
            {selectedCategory && (
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-custom-500 bg-custom-50 rounded-md dark:bg-custom-500/10">
                <Package className="size-4" />
                <span>
                  Tổng tồn kho: {totalCategoryInventory.toLocaleString()}
                </span>
              </div>
            )}
            <div className="w-64">
              <Select
                className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                options={categoryOptions}
                value={selectedCategory}
                onChange={handleCategoryChange}
                placeholder="Chọn danh mục..."
                isClearable={true}
                styles={{
                  control: (base) => ({
                    ...base,
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0 8px",
                  }),
                  input: (base) => ({
                    ...base,
                    margin: "0",
                    padding: "0",
                  }),
                }}
              />
            </div>
          </div>
        </div>

        <div className="apex-charts min-h-[450px]">
          {inventoryData.length > 0 ? (
            <ReactApexChart
              options={options}
              series={[{ data: inventoryData }]}
              type="bar"
              height={450}
            />
          ) : (
            <div className="flex items-center justify-center h-[450px] text-slate-500 dark:text-zink-200">
              {selectedCategory ? "Không có dữ liệu" : "Vui lòng chọn danh mục"}
            </div>
          )}
        </div>

        {paginationMeta.totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row">
            <div className="mb-4 grow md:mb-0">
              <p className="text-slate-500 dark:text-zink-200">
                Hiển thị <b>{inventoryData.length}</b> trên tổng{" "}
                <b>{paginationMeta.totalItems}</b> kết quả
              </p>
            </div>
            <ul className="flex flex-wrap items-center gap-2 shrink-0">
              <li>
                <button
                  className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-100 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 ${
                    paginationMeta.currentPage === 1
                      ? "disabled:text-slate-400 dark:disabled:text-zink-300 disabled:cursor-auto"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChange(paginationMeta.currentPage - 1)
                  }
                  disabled={paginationMeta.currentPage === 1}
                >
                  <ChevronLeft className="size-4 mr-1 rtl:rotate-180" /> Trang
                  trước
                </button>
              </li>
              <li>
                <button
                  className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-100 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 ${
                    paginationMeta.currentPage === paginationMeta.totalPages
                      ? "disabled:text-slate-400 dark:disabled:text-zink-300 disabled:cursor-auto"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChange(paginationMeta.currentPage + 1)
                  }
                  disabled={
                    paginationMeta.currentPage === paginationMeta.totalPages
                  }
                >
                  Trang sau{" "}
                  <ChevronRight className="size-4 ml-1 rtl:rotate-180" />
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryStatistical;