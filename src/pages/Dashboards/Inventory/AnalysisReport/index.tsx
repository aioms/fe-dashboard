import React, { useEffect, useState } from "react";
import {
  PackageSearch,
  PackagePlus,
  PackageMinus,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";

import { formatMoneyWithVND } from "helpers/utils";
import { TimePicker } from "Common/Components/TimePIcker";
import { getDate } from "helpers/date";
import {
  getTotalInventory,
  getTotalOfImportNew,
  getTotalOfReturn,
  getTotalValueInventory,
} from "apis/inventory";

// Shared Components
import BreadCrumb from "Common/BreadCrumb";

// Custom Components
import { MetricsCard } from "./components/MetricsCard";
import ImportStatistical from "./components/ImportStatistical";
import InventoryStatistical from "./components/InventoryStatistical";
import InventoryTurnover from "./components/InventoryTurnOver";
import TopInventory from "./components/TopInventory";
import DeadProductInventory from "./components/DeadProductInventory";
import OutOfStockProducts from "./components/OutOfStockProducts";

interface MetrictData {
  totalInventory: {
    value: number;
    dataset: { x: string; y: number }[];
  };
  totalValue: {
    value: number;
    dataset: { x: string; y: number }[];
  };
  newImports: {
    value: number;
    dataset: { x: string; y: number }[];
  };
  returns: {
    value: number;
    dataset: { x: string; y: number }[];
  };
}

export default function AnalysisReport() {
  // Update the state for date filters
  const [filterDates, setFilterDates] = useState({
    startDate: "", // getDate().subtract(30, "days").format(),
    endDate: "", // getDate().format(),
  });

  const [metricData, setMetricData] = useState<MetrictData>({
    totalInventory: {
      value: 0,
      dataset: [],
    },
    totalValue: {
      value: 0,
      dataset: [],
    },
    newImports: {
      value: 0,
      dataset: [],
    },
    returns: {
      value: 0,
      dataset: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          startDate: filterDates.startDate,
          endDate: filterDates.endDate,
        };

        const [totalInventory, totalValue, newImports, returns] =
          await Promise.all([
            getTotalInventory(params),
            getTotalValueInventory(params),
            getTotalOfImportNew(params),
            getTotalOfReturn(params),
          ]);

        console.log({
          totalInventory,
          totalValue,
          newImports,
          returns,
        });

        setMetricData({
          totalInventory,
          totalValue,
          newImports,
          returns,
        });
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    fetchData();
  }, [filterDates]);

  // Update the MetricCard component to handle click events
  const handleMetricClick = (_metricKey: string) => {
    // This function is used by the MetricCard components
    // Prefixing with underscore to indicate it's intentionally unused
  };

  return (
    <React.Fragment>
      <BreadCrumb title="Phân tích kho" pageTitle="Dashboard" />

      {/* Add date picker filter */}
      <div className="flex justify-end mb-4 gap-4">
        <div className="w-72">
          <TimePicker
            onChange={([date]) => {
              setFilterDates((prev) => ({
                ...prev,
                startDate: getDate(date).format(),
              }));
            }}
            props={{
              placeholder: "Ngày bắt đầu",
              id: "startDate",
            }}
          />
        </div>
        <div className="w-72">
          <TimePicker
            onChange={([date]) => {
              setFilterDates((prev) => ({
                ...prev,
                endDate: getDate(date).format(),
              }));
            }}
            props={{
              placeholder: "Ngày kết thúc",
              id: "endDate",
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
        <div
          onClick={() => handleMetricClick("totalInventory")}
          className="cursor-pointer"
        >
          <MetricsCard
            title="Tổng hàng tồn"
            value={metricData.totalInventory.value.toLocaleString()}
            icon={<Package className="size-5 text-custom-500" />}
            percentage={0}
            trend="up"
            chartData={metricData.totalInventory.dataset}
            metric="totalInventory"
          />
        </div>
        <div
          onClick={() => handleMetricClick("totalValue")}
          className="cursor-pointer"
        >
          <MetricsCard
            title="Giá trị hàng tồn"
            value={formatMoneyWithVND(metricData.totalValue.value)}
            icon={<PackageSearch className="size-5 text-custom-500" />}
            percentage={0}
            trend="up"
            chartData={metricData.totalValue.dataset}
            metric="totalValue"
          />
        </div>
        <div
          onClick={() => handleMetricClick("newArrivals")}
          className="cursor-pointer"
        >
          <MetricsCard
            title="Số lượng nhập mới"
            value={metricData.newImports.value.toLocaleString()}
            icon={<PackagePlus className="size-5 text-custom-500" />}
            percentage={3.2}
            trend="up"
            chartData={metricData.newImports.dataset}
            metric="newArrivals"
          />
        </div>
        <div
          onClick={() => handleMetricClick("returns")}
          className="cursor-pointer"
        >
          <MetricsCard
            title="Số lượng trả hàng"
            value={metricData.returns.value.toLocaleString()}
            icon={<PackageMinus className="size-5 text-custom-500" />}
            percentage={0.8}
            trend="down"
            chartData={metricData.returns.dataset}
            metric="returns"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2">
        <ImportStatistical />
        <InventoryStatistical />
        <InventoryTurnover />
        <OutOfStockProducts />
        <DeadProductInventory />
        <TopInventory />

        {/* <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-15"> Thống kê 10 hàng hóa tồn kho nhiều nhất </h6>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-zink-600">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-md bg-white dark:bg-zink-700 flex items-center justify-center">
                    <Package className="size-5 text-custom-500" />
                  </div>
                  <div>
                    <h6 className="text-15">Product A</h6>
                    <p className="text-slate-500 dark:text-zink-200">
                      Stock: 1,234
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h6 className="text-15">{formatMoneyWithVND(123456789)}</h6>
                  <p className="text-slate-500 dark:text-zink-200">Value</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
}
