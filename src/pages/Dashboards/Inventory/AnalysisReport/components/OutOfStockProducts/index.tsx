import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Package } from "lucide-react";
import { toast } from "react-toastify";
import { getDate, formatDate } from "helpers/date";
import TableCustom from "Common/TableCustom";
import { PaginationState } from "@tanstack/react-table";
import { getOutOfStockProducts } from "apis/inventory";

interface OutOfStockProduct {
  id: string;
  productName: string;
  averageDaysInventory: number;
  outOfStockDate: string;
}

type TimelineFilter = "today" | "next7days" | "next30days";

interface PaginationMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const timelineOptions = [
  { value: "today", label: "Hôm nay" },
  { value: "next7days", label: "7 ngày tới" },
  { value: "next30days", label: "30 ngày tới" },
];

export const OutOfStockProducts: FC = () => {
  const [products, setProducts] = useState<OutOfStockProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeline, setSelectedTimeline] =
    useState<TimelineFilter>("today");

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

  const columns = useMemo(
    () => [
      {
        header: "Tên sản phẩm",
        accessorKey: "productName",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="flex items-center">
            <span className="text-slate-700 dark:text-zink-100">
              {cell.getValue()}
            </span>
          </div>
        ),
      },
      {
        header: "Số ngày tồn kho trung bình",
        accessorKey: "averageDaysInventory",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="text-right">
            <span className="text-slate-700 dark:text-zink-100">
              {cell.getValue() ? `${cell.getValue()} ngày` : ""}
            </span>
          </div>
        ),
      },
      {
        header: "Ngày hết hàng dự kiến",
        accessorKey: "outOfStockDate",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const dateValue = cell.getValue();

          if (!dateValue) {
            return null;
          }

          const date = getDate(dateValue);
          const formattedDate = formatDate(dateValue);
          const isNearOutOfStock = date.diff(getDate(), "days") <= 7;

          return (
            <div className="text-right">
              <span
                className={`font-medium ${
                  isNearOutOfStock
                    ? "text-red-500 dark:text-red-400"
                    : "text-slate-700 dark:text-zink-100"
                }`}
              >
                {formattedDate}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOutOfStockProducts({
        timeline: selectedTimeline,
        page: paginationData.pageIndex + 1,
        limit: paginationData.pageSize,
      });
      console.log({ response })

      if (response.success && response.data) {
        setProducts(response.data);
        setPagination(response.metadata);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [selectedTimeline]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
              <h6 className="text-15">Dự báo hết hàng</h6>
            </div>

            <div className="w-52">
              <select
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                value={selectedTimeline}
                onChange={(e) =>
                  setSelectedTimeline(e.target.value as TimelineFilter)
                }
              >
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
            <TableCustom
              isPagination={true}
              columns={columns}
              data={products}
              totalData={pagination.totalItems}
              pageCount={pagination.totalPages}
              pagination={paginationData}
              setPaginationData={setPaginationData}
              customPageSize={10}
              divclassName="overflow-x-auto"
              tableclassName="w-full whitespace-nowrap"
              theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
              thclassName="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500"
              tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
              PaginationClassName="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OutOfStockProducts;
