import { FC, useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { getProductInventoryTurnOver } from "apis/inventory";

interface InventoryTurnoverData {
  x: string;
  y: number;
}

interface PaginationMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

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
      return value.toFixed(2) + " lần";
    },
    style: {
      fontSize: "12px",
    },
  },
  xaxis: {
    // categories: turnoverData.map((item) => item.product),
    labels: {
      style: {
        fontSize: "12px",
      },
    },
    title: {
      text: "Vòng quay tồn kho (lần)",
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
        return value.toFixed(2) + " lần";
      },
    },
  },
};

export const InventoryTurnover: FC = () => {
  const [turnoverData, setTurnoverData] = useState<InventoryTurnoverData[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMetadata>({
    currentPage: 1,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchTurnoverData = useCallback(async () => {
    try {
      const response = await getProductInventoryTurnOver({
        page: paginationMeta.currentPage,
        limit: ITEMS_PER_PAGE,
      });
      const { data, metadata, success } = response;
      if (!success) return;

      setTurnoverData(data);
      setPaginationMeta(metadata);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [paginationMeta.currentPage]);

  useEffect(() => {
    fetchTurnoverData();
  }, [fetchTurnoverData]);

  const handlePageChange = (newPage: number) => {
    setPaginationMeta((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h6 className="text-15">Vòng quay tồn kho theo sản phẩm</h6>
        </div>

        <div className="apex-charts min-h-[450px]">
          {turnoverData.length > 0 ? (
            <ReactApexChart
              options={options}
              series={[{ data: turnoverData, name: "Vòng quay tồn kho" }]}
              type="bar"
              height={450}
            />
          ) : (
            <div className="flex items-center justify-center h-[450px] text-slate-500 dark:text-zink-200">
              Không có dữ liệu
            </div>
          )}
        </div>

        {paginationMeta.totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row">
            <div className="mb-4 grow md:mb-0">
              <p className="text-slate-500 dark:text-zink-200">
                Hiển thị <b>{turnoverData.length}</b> trên tổng{" "}
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

export default InventoryTurnover;