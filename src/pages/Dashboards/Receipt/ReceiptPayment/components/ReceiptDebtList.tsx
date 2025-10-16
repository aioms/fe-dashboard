import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Icons
import {
  Search,
  Download,
  Upload,
  MoreHorizontal,
  Trash2,
  FileEdit,
  Eye,
  AlertTriangle,
  Plus,
  Mail,
  Printer,
} from "lucide-react";

// Components
import { Dropdown } from "Common/Components/Dropdown";
import DeleteModal from "Common/DeleteModal";
import TableContainer from "Common/TableContainer";
import { NoTableResult } from "Common/Components/NoTableResult";

// Utils and helpers
import { formatMoney, cleanObject } from "helpers/utils";

// Types and actions
import {
  ReceiptDebtFilterDto,
  ReceiptDebtStatus,
  ReceiptDebtType
} from "types/receiptPayment";
import { getReceiptDebtList, deleteReceiptCollection } from "slices/receipt-payment/thunk";

// Status filter options
const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: ReceiptDebtStatus.PENDING, label: "Chờ thanh toán" },
  { value: ReceiptDebtStatus.PARTIAL_PAID, label: "Đã thu 1 phần" },
  { value: ReceiptDebtStatus.COMPLETED, label: "Hoàn thành" },
  { value: ReceiptDebtStatus.OVERDUE, label: "Trễ hạn" },
];

const ReceiptDebtList: React.FC = () => {
  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.ReceiptPayment,
    (state) => ({
      data: state?.debtData || [],
      pagination: state?.debtPagination || {},
      loading: state?.debtLoading || false,
      error: state?.error || null,
    })
  );

  const { data: collections, pagination, error } = useSelector(selectDataList);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [customerFilter, setCustomerFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchCollections = useCallback(() => {
    const params: ReceiptDebtFilterDto = {
      page: currentPage,
      limit: perPage,
      keyword: searchKeyword,
      status: statusFilter as ReceiptDebtStatus,
      customerId: customerFilter,
      startDate: startDate,
      endDate: endDate,
    };
    const cleanedParams = cleanObject(params);
    dispatch(getReceiptDebtList(cleanedParams));
  }, [dispatch, currentPage, perPage, searchKeyword, statusFilter, customerFilter, startDate, endDate]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

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

  // Reset filters
  const resetFilters = () => {
    setSearchKeyword("");
    setStatusFilter("");
    setCustomerFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // Delete functionality
  const deleteToggle = () => setDeleteModal(!deleteModal);

  const onClickDelete = (collection: any) => {
    setDeleteModal(true);
    setSelectedCollection(collection);
  };

  const handleDelete = () => {
    if (selectedCollection) {
      dispatch(deleteReceiptCollection(selectedCollection.id));
      setDeleteModal(false);
      setSelectedCollection(null);
    }
  };

  // Check if debt is overdue
  const isOverdue = (dueDate: string, status: ReceiptDebtStatus) => {
    if (status === ReceiptDebtStatus.COMPLETED) return false;
    return new Date(dueDate) < new Date();
  };

  // Get status badge
  const getStatusBadge = (status: ReceiptDebtStatus) => {
    const statusConfig = {
      [ReceiptDebtStatus.PENDING]: {
        bg: "bg-red-100",
        text: "text-red-800",
        darkBg: "dark:bg-red-900",
        darkText: "dark:text-red-300",
        label: "Chờ thanh toán"
      },
      [ReceiptDebtStatus.PARTIAL_PAID]: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        darkBg: "dark:bg-yellow-900",
        darkText: "dark:text-yellow-300",
        label: "Đã thu 1 phần"
      },
      [ReceiptDebtStatus.COMPLETED]: {
        bg: "bg-green-100",
        text: "text-green-800",
        darkBg: "dark:bg-green-900",
        darkText: "dark:text-green-300",
        label: "Hoàn thành"
      },
      [ReceiptDebtStatus.OVERDUE]: {
        bg: "bg-red-100",
        text: "text-red-800",
        darkBg: "dark:bg-red-900",
        darkText: "dark:text-red-300",
        label: "Trễ hạn"
      }
    };

    const config = statusConfig[status];
    if (!config) return status;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}`}
      >
        {config.label}
      </span>
    );
  };

  // Table columns based on BRD requirements
  const columns = useMemo(
    () => [
      {
        header: "STT",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => {
          const index = cell.row.index + 1 + (currentPage - 1) * perPage;
          return <span className="text-slate-500">{index}</span>;
        },
      },
      {
        header: "Mã phiếu",
        accessorKey: "code",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => {
          const data = cell.row.original;
          const overdue = isOverdue(data.dueDate, data.status);

          return (
            <div className="flex items-center">
              {overdue && (
                <AlertTriangle className="size-4 text-red-500 mr-2" />
              )}
              <Link
                to={`/receipt-debt/detail/${data.id}`}
                className={`transition-all duration-150 ease-linear hover:text-custom-600 ${overdue ? "text-red-500" : "text-custom-500"
                  }`}
              >
                {cell.getValue()}
              </Link>
            </div>
          );
        },
      },
      {
        header: "Hạn thanh toán",
        accessorKey: "dueDate",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const date = new Date(cell.getValue());
          const data = cell.row.original;
          const overdue = isOverdue(data.dueDate, data.status);

          return (
            <span className={overdue ? "text-red-600 font-semibold" : "text-slate-700"}>
              {date.toLocaleDateString('vi-VN')}
            </span>
          );
        },
      },
      {
        header: "Khách hàng/Nhà cung cấp",
        accessorKey: "customerName",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => {
          const data = cell.row.original;
          const name = data.customerName || data.supplierName;
          const type = data.type === ReceiptDebtType.CUSTOMER_DEBT ? "Khách hàng" : "Nhà cung cấp";

          return (
            <div>
              <div className="font-medium text-slate-700 dark:text-zink-100">
                {name || "N/A"}
              </div>
              <div className="text-xs text-slate-500 dark:text-zink-200">
                {type}
              </div>
            </div>
          );
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
        header: "Tổng số tiền",
        accessorKey: "totalAmount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <span className="font-semibold text-slate-700">
            {formatMoney(cell.getValue())}
          </span>
        ),
      },
      {
        header: "Đã thanh toán",
        accessorKey: "paidAmount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <span className="font-semibold text-green-600">
            {formatMoney(cell.getValue())}
          </span>
        ),
      },
      {
        header: "Còn lại",
        accessorKey: "remainingAmount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <span className="font-semibold text-orange-600">
            {formatMoney(cell.getValue())}
          </span>
        ),
      },
      {
        header: "Thao tác",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <Dropdown
            className={`relative dropdown-collection-action ${cell.row.index >= 7 ? "dropdown-bottom" : ""
              }`}
          >
            <Dropdown.Trigger
              className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20"
              id={`collectionAction${cell.row.index}`}
            >
              <MoreHorizontal className="size-3" />
            </Dropdown.Trigger>
            <Dropdown.Content
              placement="bottom-start"
              className="absolute z-[1001] py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-lg border border-slate-200 min-w-[10rem] dark:bg-zink-600 dark:border-zink-500"
              aria-labelledby={`collectionAction${cell.row.index}`}
            >
              <li>
                <Link
                  to={`/receipt-debt/detail/${cell.row.original.id}`}
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                >
                  <Eye className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                  <span className="align-middle">Xem chi tiết</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/receipt-debt/payment/${cell.row.original.id}`}
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-500/10 dark:hover:text-green-300"
                >
                  <Plus className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                  <span className="align-middle">Thêm đợt thanh toán</span>
                </Link>
              </li>
              <li>
                <button
                  className="block w-full px-4 py-1.5 text-base transition-all duration-200 ease-linear text-left text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                  onClick={() => {
                    // Handle email reminder
                    console.log('Send email reminder for:', cell.row.original.id);
                  }}
                >
                  <Mail className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                  <span className="align-middle">Gửi email nhắc</span>
                </button>
              </li>
              <li>
                <button
                  className="block w-full px-4 py-1.5 text-base transition-all duration-200 ease-linear text-left text-slate-600 hover:bg-slate-100 hover:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200"
                  onClick={() => {
                    // Handle print
                    console.log('Print receipt for:', cell.row.original.id);
                  }}
                >
                  <Printer className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                  <span className="align-middle">In phiếu thu</span>
                </button>
              </li>
              <li>
                <Link
                  to={`/receipt-debt/edit/${cell.row.original.id}`}
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200"
                >
                  <FileEdit className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                  <span className="align-middle">Cập nhật</span>
                </Link>
              </li>
              <li>
                <button
                  className="block w-full px-4 py-1.5 text-base transition-all duration-200 ease-linear text-left text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                  onClick={() => onClickDelete(cell.row.original)}
                >
                  <Trash2 className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                  <span className="align-middle">Xóa</span>
                </button>
              </li>
            </Dropdown.Content>
          </Dropdown>
        ),
      },
    ],
    [currentPage, perPage]
  );

  // Summary calculations
  const summary = useMemo(() => {
    const totalDebts = collections.length;
    const totalRemainingDebt = collections.reduce((sum: number, debt: any) => sum + debt.remainingAmount, 0);
    const overdueDebts = collections.filter((debt: any) =>
      isOverdue(debt.dueDate, debt.status)
    ).length;

    return {
      totalDebts,
      totalRemainingDebt,
      overdueDebts
    };
  }, [collections]);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Có lỗi xảy ra khi tải dữ liệu</div>
        <div className="text-sm text-slate-500">{error}</div>
        <button
          onClick={fetchCollections}
          className="mt-4 px-4 py-2 bg-custom-500 text-white rounded-md hover:bg-custom-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />

      {/* Search and Filters - Following OrderList pattern */}
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
            placeholder="Tìm mã phiếu hoặc tên khách hàng/nhà cung cấp..."
            autoComplete="off"
            onChange={handleSearchChange}
          />
          <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
        </div>

        {/* Status Filter */}
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

        {/* Type Filter */}
        <div>
          <select
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          >
            <option value="">Tất cả loại nợ</option>
            <option value={ReceiptDebtType.CUSTOMER_DEBT}>Nợ khách hàng</option>
            <option value={ReceiptDebtType.SUPPLIER_DEBT}>Nợ nhà cung cấp</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
            onClick={resetFilters}
          >
            Xóa lọc
          </button>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <input
            type="date"
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
            placeholder="Từ hạn thanh toán"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
            placeholder="Đến hạn thanh toán"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Action Buttons - Export/Import */}
        <div className="lg:col-span-2">
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="text-green-500 bg-white btn hover:text-green-500 hover:bg-green-100 focus:text-green-500 focus:bg-green-100 active:text-green-500 active:bg-green-100 dark:bg-zink-700 dark:hover:bg-green-500/10 dark:focus:bg-green-500/10 dark:active:bg-green-500/10"
              onClick={() => {
                // Handle export
                console.log('Export receipt collections');
              }}
            >
              <Download className="inline-block size-4 mr-1" />
              Xuất danh sách
            </button>
            <button
              type="button"
              className="text-blue-500 bg-white btn hover:text-blue-500 hover:bg-blue-100 focus:text-blue-500 focus:bg-blue-100 active:text-blue-500 active:bg-blue-100 dark:bg-zink-700 dark:hover:bg-blue-500/10 dark:focus:bg-blue-500/10 dark:active:bg-blue-500/10"
              onClick={() => {
                // Handle import
                console.log('Import receipt collections');
              }}
            >
              <Upload className="inline-block size-4 mr-1" />
              Tải danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-5">
        <div className="p-4 bg-slate-50 dark:bg-zink-600 rounded-md">
          <div className="text-sm text-slate-500 dark:text-zink-200">Tổng số khoản nợ</div>
          <div className="text-2xl font-bold text-slate-700 dark:text-zink-100">
            {summary.totalDebts}
          </div>
          {summary.overdueDebts > 0 && (
            <div className="text-xs text-red-500 mt-1">
              {summary.overdueDebts} khoản quá hạn
            </div>
          )}
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-md">
          <div className="text-sm text-red-500">Tổng số tiền còn lại</div>
          <div className="text-2xl font-bold text-red-600">
            {formatMoney(summary.totalRemainingDebt)}
          </div>
        </div>
      </div>

      {/* Table */}
      {collections && collections.length > 0 ? (
        <TableContainer
          isPagination={true}
          columns={columns}
          data={collections || []}
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
    </React.Fragment>
  );
};

export default ReceiptDebtList;