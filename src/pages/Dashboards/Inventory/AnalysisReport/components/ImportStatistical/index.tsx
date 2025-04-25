import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";
import debounce from "lodash.debounce";

import { getProductList as onGetProductList } from "slices/thunk";
import { TimePicker } from "Common/Components/TimePIcker";
import { getDate } from "helpers/date";
import { getImportProductsDataset } from "apis/inventory";

const inventoryChartOptions = {
  chart: {
    height: 350,
    type: "area" as const,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth" as const,
  },
  xaxis: {
    type: "datetime" as const,
    categories: ["2024-01-01", "2024-02-01", "2024-03-01", "2024-04-01"],
  },
  tooltip: {
    x: {
      format: "dd/MM/yy",
    },
  },
};

export const ImportStatistical: FC = () => {
  const dispatch = useDispatch<any>();

  const [dataset, setDataset] = useState<{ x: string; y: number }[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productSearchText, setProductSearchText] = useState("");
  const [productOptions, setProductOptions] = useState<any[]>([]);

  const [filterDates, setFilterDates] = useState({
    startDate: "", // getDate().subtract(30, "days").format(),
    endDate: "", // getDate().format(),
  });

  // Load product options
  const loadProducts = useCallback(async () => {
    try {
      dispatch(onGetProductList({ keyword: productSearchText }))
        .unwrap()
        .then((response: any) => {
          if (response && response.data) {
            const options = response.data.map((product: any) => ({
              value: product.id,
              label: product.name || product.productName,
            }));
            setProductOptions(options);
          }
        })
        .catch((error: Error) => {
          toast.error(error.message);
        });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [dispatch, productSearchText]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, productSearchText]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          productId: selectedProduct?.value || "",
          startDate: filterDates.startDate,
          endDate: filterDates.endDate,
        };

        const result = await getImportProductsDataset(params);

        if (result && result.length) {
          setDataset(result);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    fetchData();
  }, [filterDates, selectedProduct]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h6 className="text-15 grow">Thống kê nhập kho</h6>
        </div>
        <div className="flex items-end gap-3 mb-4">
          <div className="w-64">
            <label
              htmlFor="productSelect"
              className="inline-block mb-1.5 text-sm font-medium"
            >
              Sản phẩm
            </label>
            <Select
              className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
              id="productSelect"
              options={productOptions}
              value={selectedProduct}
              onChange={(option) => setSelectedProduct(option)}
              placeholder="Tìm theo mã, tên..."
              isClearable={true}
              isSearchable={true}
              onInputChange={debounce(
                (inputValue) => setProductSearchText(inputValue),
                500
              )}
            />
          </div>
          <div className="w-52">
            <label
              htmlFor="startDate"
              className="inline-block mb-1.5 text-sm font-medium"
            >
              Ngày bắt đầu
            </label>
            <TimePicker
              onChange={([date]) => {
                setFilterDates((prev) => ({
                  ...prev,
                  startDate: getDate(date).format(),
                }));
              }}
              props={{
                placeholder: "Chọn ngày",
                id: "startDateInventory",
              }}
            />
          </div>
          <div className="w-52">
            <label
              htmlFor="endDate"
              className="inline-block mb-1.5 text-sm font-medium"
            >
              Ngày kết thúc
            </label>
            <TimePicker
              onChange={([date]) => {
                setFilterDates((prev) => ({
                  ...prev,
                  endDate: getDate(date).format(),
                }));
              }}
              props={{
                placeholder: "Chọn ngày",
                id: "endDateInventory",
              }}
            />
          </div>
        </div>
        <div className="apex-charts">
          <ReactApexChart
            dir="ltr"
            className="apex-charts"
            series={[{ data: dataset, name: "Số lượng nhập kho" }]}
            options={{
              ...inventoryChartOptions,
            }}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ImportStatistical;