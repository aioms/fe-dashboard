import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { PaginationState } from "@tanstack/react-table";

// Icons
import {
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  FileEdit,
  Eye,
} from "lucide-react";

// Components
import { Dropdown } from "Common/Components/Dropdown";
import DeleteModal from "Common/DeleteModal";
import TableCustom from "Common/TableCustom";
import { NoTableResult } from "Common/Components/NoTableResult";

// Utils and helpers
import { formatMoney, cleanObject, formatDateTime } from "helpers/utils";

// Types and actions
import {
  ReceiptPaymentFilterDto
} from "types/receiptPayment";
import {
  getReceiptPaymentList,
  deleteReceiptPayment,
  getReceiptPaymentSummary
} from "slices/receipt-payment/thunk";

// Components
import ReceiptPaymentFilters from "./ReceiptPaymentFilters";
import PaymentStatusBadge from "./PaymentStatusBadge";
import ExpenseTypeBadge from "./ExpenseTypeBadge";

const selectDataList = createSelector(
  (state: any) => state.ReceiptPayment,
  (state) => ({
    data: state?.data || [],
    pagination: state?.pagination || {},
    loading: state?.loading || false,
    error: state?.error || null,
    summary: state?.summary || null,
    summaryLoading: state?.summaryLoading || false,
  })
);

const areFiltersEqual = (
  first: ReceiptPaymentFilterDto,
  second: ReceiptPaymentFilterDto
) => {
  const keys = Array.from(
    new Set([...Object.keys(first), ...Object.keys(second)])
  ) as Array<keyof ReceiptPaymentFilterDto>;

  return keys.every((key) => first[key] === second[key]);
};

const ReceiptPaymentList: React.FC = () => {
  const dispatch = useDispatch<any>();

  const { data: payments, pagination, loading, error, summary, summaryLoading } = useSelector(selectDataList);

  const [filters, setFilters] = useState<ReceiptPaymentFilterDto>({});

  const [paginationData, setPaginationData] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pagination.limit || 10,
  });

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const pageIndex = paginationData.pageIndex;
  const pageSize = paginationData.pageSize;

  const updatePaginationData = useCallback(
    (nextState: PaginationState | ((previous: PaginationState) => PaginationState)) => {
      setPaginationData((previous) => {
        const next =
          typeof nextState === "function"
            ? (nextState as (value: PaginationState) => PaginationState)(previous)
            : nextState;

        if (
          previous.pageIndex === next.pageIndex &&
          previous.pageSize === next.pageSize
        ) {
          return previous;
        }

        return next;
      });
    },
    []
  );

  const updateFilters = useCallback<React.Dispatch<React.SetStateAction<ReceiptPaymentFilterDto>>>(
    (nextFilters) => {
      setPaginationData((prev) =>
        prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
      );
      setFilters((prev) => {
        const next =
          typeof nextFilters === "function"
            ? (nextFilters as (value: ReceiptPaymentFilterDto) => ReceiptPaymentFilterDto)(prev)
            : nextFilters;

        return areFiltersEqual(prev, next) ? prev : next;
      });
    },
    []
  );

  const fetchPayments = useCallback(() => {
    const params = {
      ...filters,
      page: pageIndex + 1,
      limit: pageSize,
    };
    const cleanedParams = cleanObject(params);
    dispatch(getReceiptPaymentList(cleanedParams));
  }, [dispatch, filters, pageIndex, pageSize]);

  const fetchSummary = useCallback(() => {
    const cleanedParams = cleanObject(filters);
    dispatch(getReceiptPaymentSummary(cleanedParams));
  }, [dispatch, filters]);

  useEffect(() => {
    fetchPayments();
    fetchSummary();
  }, [fetchPayments, fetchSummary]);

  const debouncedSearch = useMemo(
    () =>
      debounce((keyword: string) => {
        updateFilters((prev) => ({
          ...prev,
          keyword,
        }));
      }, 700),
    [updateFilters]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Search functionality
  const filterSearchData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim();
    debouncedSearch(keyword);
  };

  // Reset filters
  const resetFilters = () => {
    updateFilters({});

    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  const clearSearch = useCallback(() => {
    updateFilters(prev => ({
      ...prev,
      keyword: undefined,
    }));
  }, [updateFilters]);

  // Delete functionality
  const deleteToggle = () => setDeleteModal(!deleteModal);

  const onClickDelete = (payment: any) => {
    setDeleteModal(true);
    setSelectedPayment(payment);
  };

  const handleDelete = async () => {
    if (selectedPayment) {
      try {
        await dispatch(deleteReceiptPayment(selectedPayment.id)).unwrap();
        setDeleteModal(false);
        setSelectedPayment(null);
        fetchPayments();
      } catch {
        // The thunk displays the API error and keeps the modal open for retry.
      }
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        header: "Mã phiếu",
        accessorKey: "code",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <Link
            to={`/receipt-payment/detail/${cell.row.original.id}`}
            className="font-medium transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600"
          >
            {cell.getValue()}
          </Link>
        ),
      },
      {
        header: "Ngày chi",
        accessorKey: "paymentDate",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const date = cell.getValue();
          return (
            <span className="whitespace-nowrap">
              {date ? formatDateTime(date, true) : "-"}
            </span>
          );
        },
      },
      {
        header: "Loại chi phí",
        accessorKey: "expenseType",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <ExpenseTypeBadge
            type={cell.getValue()}
            customName={cell.row.original.expenseTypeName}
          />
        ),
      },
      {
        header: "Đối tượng chi",
        accessorKey: "paymentObject",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => {
          const value = cell.getValue();
          const supplier = cell.row.original.supplier;
          return (
            <span className="block max-w-[14rem] whitespace-normal break-words text-slate-700 dark:text-zink-100">
              {value || supplier?.name || "-"}
            </span>
          );
        },
      },
      {
        header: "Số tiền",
        accessorKey: "amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <span className="font-semibold whitespace-nowrap text-slate-700 dark:text-zink-100">
            {formatMoney(cell.getValue())}
          </span>
        ),
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => <PaymentStatusBadge status={cell.getValue()} />,
      },
      {
        header: "Ghi chú",
        accessorKey: "notes",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => {
          const notes = cell.getValue();
          return notes ? (
            <span className="block max-w-[18rem] whitespace-normal break-words text-sm text-slate-500 dark:text-zink-200">
              {notes.length > 50 ? `${notes.substring(0, 50)}...` : notes}
            </span>
          ) : "-";
        },
      },
      {
        header: "Thao tác",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <Dropdown className="relative">
            <Dropdown.Trigger className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white">
              <MoreHorizontal className="size-3" />
              <span className="sr-only">Mở menu thao tác</span>
            </Dropdown.Trigger>
            <Dropdown.Content className="absolute z-[1001] list-none py-2 px-1 bg-white rounded-md shadow-lg border border-slate-200 dropdown-menu min-w-[10rem] dark:bg-zink-600 dark:border-zink-500">
              <li>
                <Link
                  to={`/receipt-payment/detail/${cell.row.original.id}`}
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200"
                >
                  <Eye className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                  <span className="align-middle">Xem chi tiết</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/receipt-payment/edit/${cell.row.original.id}`}
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200"
                >
                  <FileEdit className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                  <span className="align-middle">Chỉnh sửa</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
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
    []
  );

  // Summary calculations now handled by backend via getReceiptPaymentSummary

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Có lỗi xảy ra khi tải dữ liệu</div>
        <div className="text-sm text-slate-500">{error}</div>
        <button
          onClick={fetchPayments}
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

      {/* Filters and Search */}
      <div className="grid grid-cols-1 gap-4 mb-5 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
              placeholder="Tìm kiếm theo mã phiếu, đối tượng chi..."
              autoComplete="off"
              onChange={filterSearchData}
              onBlur={() => {
                if (!searchInputRef.current?.value.trim()) clearSearch();
              }}
            />
            <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
          </div>
        </div>

        <div className="xl:col-span-7">
          <ReceiptPaymentFilters filters={filters} setFilters={updateFilters} />
        </div>

        <div className="xl:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
            <button
              type="button"
              className="w-full text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10 sm:w-auto"
              onClick={resetFilters}
            >
              Xóa lọc
            </button>
            <Link
              to="/receipt-payment/create"
              className="w-full text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 sm:w-auto"
            >
              <Plus className="inline-block size-4" />
              <span className="align-middle">Tạo phiếu chi</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-5">
        <div className="p-4 bg-slate-50 dark:bg-zink-600 rounded-md flex flex-col justify-center">
          <div className="text-sm text-slate-500 dark:text-zink-200">Tổng số phiếu</div>
          <div className="text-xl font-semibold text-slate-700 dark:text-zink-100">
            {summaryLoading ? "-" : (summary?.totalCount ?? 0)}
          </div>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-md">
          <div className="text-sm text-red-500">Tổng Nợ Chi</div>
          <div className="text-xl font-semibold text-red-600">
            {summaryLoading ? "-" : (summary?.totalDebtAmount ? formatMoney(summary.totalDebtAmount) : "0")}
          </div>
          <div className="text-xs text-red-400 mt-1">
            Số lượng: {summary?.totalDebtCount ?? 0} phiếu
          </div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-md">
          <div className="text-sm text-green-500">Tổng Đã Chi</div>
          <div className="text-xl font-semibold text-green-600">
            {summaryLoading ? "-" : (summary?.totalPaidAmount ? formatMoney(summary.totalPaidAmount) : "0")}
          </div>
          <div className="text-xs text-green-400 mt-1">
            Số lượng: {summary?.totalPaidCount ?? 0} phiếu
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div
          className="mt-5 space-y-3"
          aria-busy="true"
          aria-label="Đang tải danh sách phiếu chi"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-md bg-slate-100 dark:bg-zink-600"
            />
          ))}
        </div>
      ) : payments && payments.length > 0 ? (
        <TableCustom
          isPagination={true}
          columns={columns}
          data={payments}
          totalData={pagination.totalItems}
          pageCount={pagination.totalPages}
          pagination={paginationData}
          setPaginationData={updatePaginationData}
          divclassName="mt-5 overflow-x-auto"
          tableclassName="w-full min-w-[980px]"
          theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
          thclassName="px-3.5 py-2.5 font-semibold text-slate-500 border-b border-slate-200 dark:border-zink-500 dark:text-zink-200"
          tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
          PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
        />
      ) : (
        <NoTableResult />
      )}
    </React.Fragment>
  );
};

export default ReceiptPaymentList;
