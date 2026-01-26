import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { MoreHorizontal, Search, Eye } from "lucide-react";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";

import BreadCrumb from "Common/BreadCrumb";
import { Dropdown } from "Common/Components/Dropdown";
import TableContainer from "Common/TableContainer";
import { NoTableResult } from "Common/Components/NoTableResult";
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  PaymentMethod,
  PAYMENT_METHOD_LABELS,
} from "Common/constants/order-constant";
import {
  getOrdersThunk,
} from "slices/order/thunk";
import { formatDateTime, formatMoney, isHasKey } from "helpers/utils";
import { resetMessage } from "slices/order/reducer";

import "./OrderList.css";

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: OrderStatus.DRAFT, label: ORDER_STATUS_LABELS[OrderStatus.DRAFT] },
  {
    value: OrderStatus.PENDING,
    label: ORDER_STATUS_LABELS[OrderStatus.PENDING],
  },
  {
    value: OrderStatus.CANCELLED,
    label: ORDER_STATUS_LABELS[OrderStatus.CANCELLED],
  },
  {
    value: OrderStatus.COMPLETED,
    label: ORDER_STATUS_LABELS[OrderStatus.COMPLETED],
  },
];

const paymentMethodOptions = [
  { value: "", label: "Tất cả phương thức" },
  {
    value: PaymentMethod.CASH,
    label: PAYMENT_METHOD_LABELS[PaymentMethod.CASH],
  },
  {
    value: PaymentMethod.BANK_TRANSFER,
    label: PAYMENT_METHOD_LABELS[PaymentMethod.BANK_TRANSFER],
  },
];

const OrderList = () => {
  const dispatch = useDispatch<any>();

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectOrderList = createSelector(
    (state: any) => state.Order,
    (order) => ({
      orders: order.orders,
      pagination: order.pagination,
      message: order.message,
    })
  );

  const { orders, pagination, message } = useSelector(selectOrderList);

  // Fetch orders
  const fetchOrders = useCallback(() => {
    const params = {
      page: currentPage,
      limit: perPage,
      keyword: searchKeyword,
      status: statusFilter,
      paymentMethod: paymentMethodFilter,
      startDate,
      endDate,
    };
    dispatch(getOrdersThunk(params));
  }, [
    dispatch,
    currentPage,
    perPage,
    searchKeyword,
    statusFilter,
    paymentMethodFilter,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        setSearchKeyword(searchValue);
        setCurrentPage(1); // Reset to first page when searching
      }, 500),
    []
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  useEffect(() => {
    if (!isHasKey(message)) return;

    switch (message.type) {
      case "error":
        toast.error(message.text);
        break;
      case "success":
        toast.success(message.text);
        break;
      default:
        break;
    }

    // Reset message state
    dispatch(resetMessage());
  }, [message, dispatch]);

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      [OrderStatus.DRAFT]: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        darkBg: "dark:bg-gray-900",
        darkText: "dark:text-gray-300",
      },
      [OrderStatus.PENDING]: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        darkBg: "dark:bg-yellow-900",
        darkText: "dark:text-yellow-300",
      },
      [OrderStatus.CANCELLED]: {
        bg: "bg-red-100",
        text: "text-red-800",
        darkBg: "dark:bg-red-900",
        darkText: "dark:text-red-300",
      },
      [OrderStatus.COMPLETED]: {
        bg: "bg-green-100",
        text: "text-green-800",
        darkBg: "dark:bg-green-900",
        darkText: "dark:text-green-300",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return status;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}`}
      >
        {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ||
          status}
      </span>
    );
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        header: "Mã đơn hàng",
        accessorKey: "code",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const data = cell.row.original;
          return (
            <Link
              to={`/orders/${data.id}`}
              className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600 order-id"
            >
              {cell.getValue()}
            </Link>
          );
        },
      },
      {
        header: "Khách hàng",
        accessorKey: "customer.name",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <div className="flex items-center gap-2">
              <div className="grow">
                <h6 className="mb-1">
                  <span className="name transition-all duration-150 ease-linear text-slate-600 dark:text-zink-200">
                    {cell.getValue() ?? 'Khách lẻ'}
                  </span>
                </h6>
              </div>
            </div>
          );
        },
      },
      {
        header: "Phương thức thanh toán",
        accessorKey: "paymentMethod",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const method = cell.getValue();
          return (
            PAYMENT_METHOD_LABELS[
              method as keyof typeof PAYMENT_METHOD_LABELS
            ] || method
          );
        },
      },
      {
        header: "Tổng tiền",
        accessorKey: "totalAmount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const value = cell.getValue();
          return formatMoney(value);
        },
      },
      {
        header: "Giảm giá",
        accessorKey: "discountAmount",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const value = cell.getValue();
          return formatMoney(value);
        },
      },
      {
        header: "Số lượng SP",
        accessorKey: "orderItems",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const { items } = cell.row.original;
          return items.length;
        },
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const status = cell.getValue();
          return getStatusBadge(status);
        },
      },
      {
        header: "Ngày tạo",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const date = cell.getValue();
          return date ? formatDateTime(date, true) : "";
        },
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <Dropdown
            className={`relative dropdown-order-action ${
              cell.row.index >= 7 ? "dropdown-bottom" : ""
            }`}
          >
            <Dropdown.Trigger
              className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20"
              id="ordersAction1"
            >
              <MoreHorizontal className="size-3" />
            </Dropdown.Trigger>
            <Dropdown.Content
              placement="bottom-start"
              className="absolute z-[1001] py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-lg border border-slate-200 min-w-[10rem] dark:bg-zink-600 dark:border-zink-500 transform -translate-x-full"
              aria-labelledby="ordersAction1"
            >
              <li>
                <Link
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                  to={`/orders/${cell.row.original.id}`}
                >
                  <Eye className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "}
                  <span className="align-middle">Xem chi tiết</span>
                </Link>
              </li>
            </Dropdown.Content>
          </Dropdown>
        ),
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <BreadCrumb title="Danh sách đơn hàng" pageTitle="Orders" />
      <div className="card" id="orderList">
        <div className="card-body">
          {/* First Row - Search and Status/Payment Method Filters */}
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Tìm kiếm đơn hàng..."
                autoComplete="off"
                onChange={handleSearchChange}
              />
              <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
            </div>
            <div>
              <select
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
              >
                {paymentMethodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Second Row - Date Filters and Actions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <input
                type="date"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
                placeholder="Từ ngày"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <input
                type="date"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
                placeholder="Đến ngày"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="lg:col-span-2">
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                  onClick={() => {
                    setSearchKeyword("");
                    setStatusFilter("");
                    setPaymentMethodFilter("");
                    setStartDate("");
                    setEndDate("");
                    setCurrentPage(1);
                    if (searchInputRef.current) {
                      searchInputRef.current.value = "";
                    }
                  }}
                >
                  Xóa lọc
                  <i className="align-baseline ltr:pl-1 rtl:pr-1 ri-close-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" id="orderTable">
        <div className="card-body">
          {orders && orders.length > 0 ? (
            <TableContainer
              isPagination={true}
              columns={columns}
              data={orders || []}
              customPageSize={perPage}
              divclassName="overflow-x-auto table-dropdown-container"
              tableclassName="w-full whitespace-nowrap"
              theadclassName="ltr:text-left rtl:text-right bg-slate-100 text-slate-500 dark:text-zink-200 dark:bg-zink-600"
              thclassName="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500"
              tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500 relative"
              PaginationClassName="flex justify-end mt-4"
              metadata={pagination}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(pageSize) => setPerPage(pageSize)}
            />
          ) : (
            <NoTableResult />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default OrderList;
