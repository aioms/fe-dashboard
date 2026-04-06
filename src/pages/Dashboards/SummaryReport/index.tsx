import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import BreadCrumb from "Common/BreadCrumb";
import {
  ShoppingBag,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  ClipboardCheck,
  Calendar,
  FilterX,
  TrendingUp,
  DollarSign
} from "lucide-react";
import SummaryCard from "./components/SummaryCard";
import PaymentTable from "./components/PaymentTable";
import OrdersTable from "./components/OrdersTable";
import ReceiptDebtsTable from "./components/ReceiptDebtsTable";
import { TimePicker } from "Common/Components/TimePIcker";
import dayjs from "dayjs";
import { getTransactionSummary } from "apis/transaction";
import {
  RECEIPT_CHECK_STATUS_OPTIONS,
  RECEIPT_IMPORT_STATUS_OPTIONS,
  RECEIPT_RETURN_STATUS_OPTIONS,
  RECEIPT_DEBT_STATUS_OPTIONS
} from "Common/constants/receipt-constant";
import {
  TransactionSummaryResponse,
} from "./types";

const SummaryReport = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()]);

  const initialFilters = useMemo(() => ({
    orders: searchParams.get("orderStatus") || "all",
    orderType: searchParams.get("orderType") || "all",
    debt: searchParams.get("receiptDebtStatus") || "all",
    checks: searchParams.get("receiptCheckStatus") || "all",
    imports: searchParams.get("receiptImportStatus") || "all",
    returns: searchParams.get("receiptReturnStatus") || "all",
    paymentStatus: searchParams.get("paymentStatus") || "all",
    paymentType: searchParams.get("paymentType") || "all",
  }), [searchParams]);

  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const [activeTab, setActiveTab] = useState<"orders" | "debts">("orders");
  const [data, setData] = useState<TransactionSummaryResponse["data"] | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const startDate = dateRange[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");

      const params: any = {
        date: startDate,
      };

      if (filters.orders !== "all") params.orderStatus = filters.orders;
      if (filters.orderType !== "all") params.orderType = filters.orderType;
      if (filters.debt !== "all") params.receiptDebtStatus = filters.debt;
      if (filters.checks !== "all") params.receiptCheckStatus = filters.checks;
      if (filters.imports !== "all") params.receiptImportStatus = filters.imports;
      if (filters.returns !== "all") params.receiptReturnStatus = filters.returns;
      if (filters.paymentStatus !== "all") params.paymentStatus = filters.paymentStatus;
      if (filters.paymentType !== "all") params.paymentType = filters.paymentType;

      const response = await getTransactionSummary(params);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch transaction summary:", error);
    }
  }, [dateRange, filters]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleStatusChange = (section: string, status: string) => {
    const sectionToQueryParam: Record<string, string> = {
      orders: "orderStatus",
      orderType: "orderType",
      debt: "receiptDebtStatus",
      checks: "receiptCheckStatus",
      imports: "receiptImportStatus",
      returns: "receiptReturnStatus",
      paymentStatus: "paymentStatus",
      paymentType: "paymentType",
    };

    const paramName = sectionToQueryParam[section];
    if (paramName) {
      const newParams = new URLSearchParams(searchParams);
      if (status === "all") {
        newParams.delete(paramName);
      } else {
        newParams.set(paramName, status);
      }
      setSearchParams(newParams);
    }
    setFilters(prev => ({ ...prev, [section]: status }));
  };

  const resetFilters = () => {
    setDateRange([new Date(), new Date()]);
    setSearchParams({});
    setFilters({
      orders: "all",
      orderType: "all",
      debt: "all",
      checks: "all",
      imports: "all",
      returns: "all",
      paymentStatus: "all",
      paymentType: "all",
    });
  };

  const formattedStartDate = dateRange[0] ? dayjs(dateRange[0]).format("DD/MM/YYYY") : "";
  const formattedEndDate = dateRange[1] ? dayjs(dateRange[1]).format("DD/MM/YYYY") : "";
  const dateDisplay = formattedStartDate === formattedEndDate ? formattedStartDate : `${formattedStartDate} - ${formattedEndDate}`;

  // Mapping API data to SummaryCard items
  const summary = data?.summary;

  return (
    <div className="page-content bg-gray-50 dark:bg-zink-800 min-h-screen pb-10">
      <div className="container-fluid">
        <BreadCrumb title="Báo cáo Tổng hợp" pageTitle="Bảng điều khiển" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 bg-white dark:bg-zink-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-zink-600">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-zink-50">
                Tổng hợp Giao dịch
              </h4>
              <p className="text-gray-500 dark:text-zink-400 text-base">{dateDisplay}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <TimePicker
                value={dateRange as any}
                onChange={(dates: any) => setDateRange(dates)}
                props={{
                  placeholder: "Chọn khoảng thời gian",
                  id: "dateRange",
                  className: "text-base",
                  options: {
                    mode: "range",
                    dateFormat: "d/m/Y",
                    defaultDate: [new Date(), new Date()]
                  }
                }}
              />
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-zink-600 text-gray-600 dark:text-zink-200 rounded-lg hover:bg-gray-200 dark:hover:bg-zink-500 transition-colors text-base font-medium"
              title="Xóa lọc"
            >
              <FilterX size={18} />
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-zink-600 mx-1 hidden md:block"></div>
            {/* <button className="flex items-center px-5 py-2.5 bg-white dark:bg-zink-700 border border-gray-200 dark:border-zink-600 rounded-lg text-gray-700 dark:text-zink-100 hover:bg-gray-50 dark:hover:bg-zink-600 transition-colors shadow-sm text-base font-medium">
              <Download size={18} className="mr-2" />
              Xuất PDF
            </button>
            <button className="flex items-center px-5 py-2.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-md shadow-blue-200 dark:shadow-none text-base font-medium disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : "Làm mới"}
            </button> */}
          </div>
        </div>

        {/* Revenue and Profit Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <SummaryCard
            title="Doanh thu"
            icon={TrendingUp}
            iconClass="success"
            items={[
              { label: "Tổng Doanh thu", value: data?.totalRevenue ?? 0, isCurrency: true },
              { label: "Doanh thu Đơn hàng", value: data?.breakdown.orders.revenue ?? 0, isCurrency: true },
              { label: "Doanh thu Công nợ", value: data?.breakdown.debts.revenue ?? 0, isCurrency: true },
            ]}
          />
          <SummaryCard
            title="Lợi nhuận gộp"
            icon={DollarSign}
            iconClass="info"
            items={[
              { label: "Tổng Lợi nhuận", value: data?.grossProfit ?? 0, isCurrency: true },
              { label: "Tổng Giá vốn", value: data?.totalCost ?? 0, isCurrency: true },
              { label: "Tỷ suất LN", value: data?.totalRevenue ? (data.grossProfit / data.totalRevenue) * 100 : 0, isCurrency: false, suffix: "%" },
            ]}
          />
        </div>

        {/* Top Row: Orders and Debt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Tổng Đơn hàng"
            icon={ShoppingBag}
            iconClass="primary"
            showStatusFilter={true}
            value={filters.orders}
            onStatusChange={(status) => handleStatusChange("orders", status)}
            items={[
              { label: "Tổng số lượng Đơn hàng", value: summary?.orders.count ?? 0 },
              { label: "Tổng Giá trị Đơn hàng", value: summary?.orders.totalAmount ?? 0, isCurrency: true },
            ]}
          />
          <SummaryCard
            title="Tổng Công nợ Phải thu"
            icon={CreditCard}
            iconClass="danger"
            showStatusFilter={true}
            value={filters.debt}
            statusOptions={RECEIPT_DEBT_STATUS_OPTIONS}
            onStatusChange={(status) => handleStatusChange("debt", status)}
            items={[
              { label: "Tổng Số lượng", value: summary?.receiptDebts.count ?? 0 },
              { label: "Tổng Giá trị", value: summary?.receiptDebts.totalAmount ?? 0, isCurrency: true },
            ]}
          />
          <SummaryCard
            title="Tổng Phiếu Kiểm kho"
            icon={ClipboardCheck}
            iconClass="warning"
            showStatusFilter={true}
            value={filters.checks}
            statusOptions={RECEIPT_CHECK_STATUS_OPTIONS}
            onStatusChange={(status) => handleStatusChange("checks", status)}
            items={[
              { label: "Tổng Số lượng", value: summary?.receiptChecks.count ?? 0 },
              { label: "Giá trị Chênh lệch", value: summary?.receiptChecks.totalAmount ?? 0, isCurrency: true },
            ]}
          />
        </div>

        {/* Second Row: Imports and Returns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <SummaryCard
            title="Tổng Phiếu Nhập hàng"
            icon={ArrowDownCircle}
            iconClass="success"
            showStatusFilter={true}
            value={filters.imports}
            statusOptions={RECEIPT_IMPORT_STATUS_OPTIONS}
            onStatusChange={(status) => handleStatusChange("imports", status)}
            items={[
              { label: "Tổng Số lượng", value: summary?.receiptImports.count ?? 0 },
              { label: "Tổng Giá trị", value: summary?.receiptImports.totalAmount ?? 0, isCurrency: true },
            ]}
          />
          <SummaryCard
            title="Tổng Phiếu Trả hàng"
            icon={ArrowUpCircle}
            iconClass="info"
            showStatusFilter={true}
            value={filters.returns}
            statusOptions={RECEIPT_RETURN_STATUS_OPTIONS}
            onStatusChange={(status) => handleStatusChange("returns", status)}
            items={[
              { label: "Tổng Số lượng", value: summary?.receiptReturns.count ?? 0 },
              { label: "Tổng Giá trị", value: summary?.receiptReturns.totalAmount ?? 0, isCurrency: true },
            ]}
          />
        </div>

        {/* Detail Tables Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200 dark:border-zink-600 mb-4">
            <button
              className={`px-6 py-4 text-base font-bold transition-all border-b-2 ${
                activeTab === "orders"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-zink-400 dark:hover:text-zink-200"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Đơn hàng Hôm nay
            </button>
            <button
              className={`px-6 py-4 text-base font-bold transition-all border-b-2 ${
                activeTab === "debts"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-zink-400 dark:hover:text-zink-200"
              }`}
              onClick={() => setActiveTab("debts")}
            >
              Công nợ Hôm nay
            </button>
          </div>

          <div className="transition-all duration-300">
            {activeTab === "orders" ? (
              <OrdersTable
                orders={data?.orderDetails ?? []}
                onStatusChange={(status) => handleStatusChange("orders", status)}
                onTypeChange={(type) => handleStatusChange("orderType", type)}
              />
            ) : (
              <ReceiptDebtsTable
                receiptDebts={data?.receiptDebtDetails ?? []}
                onStatusChange={(status) => handleStatusChange("debt", status)}
              />
            )}
          </div>
        </div>

        {/* Payments Table */}
        <div className="mt-8">
          <PaymentTable
            payments={data?.paymentsGroupedByMethod.flatMap(group => group.payments).map(p => ({
              id: p.code,
              method: p.type === 1 ? "Đơn hàng" : "Công nợ",
              status: p.status,
              type: p.type,
              total: p.totalAmount,
              collectedAmount: p.collectedAmount,
              outstandingAmount: p.outstandingAmount,
              transactions: p.transactions.map(t => ({
                id: t.code,
                amount: t.amount,
                description: t.description || `Thanh toán cho ${p.code}`,
                status: t.status,
                processedAt: t.processedAt,
                paymentMethod: t.paymentMethod
              }))
            })) ?? []}
            selectedStatus={filters.paymentStatus}
            selectedType={filters.paymentType}
            onStatusChange={(status) => handleStatusChange("paymentStatus", status)}
            onTypeChange={(type) => handleStatusChange("paymentType", type)}
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryReport;

