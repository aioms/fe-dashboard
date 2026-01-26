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
  ReceiptPaymentFilterDto,
  ReceiptPaymentStatus
} from "types/receiptPayment";
import {
  getReceiptPaymentList,
  deleteReceiptPayment
} from "slices/receipt-payment/thunk";

// Components
import ReceiptPaymentFilters from "./ReceiptPaymentFilters";
import PaymentStatusBadge from "./PaymentStatusBadge";
import ExpenseTypeBadge from "./ExpenseTypeBadge";

const ReceiptPaymentList: React.FC = () => {
  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.ReceiptPayment,
    (state) => ({
      data: state?.data || [],
      pagination: state?.pagination || {},
      loading: state?.loading || false,
      error: state?.error || null,
    })
  );

  const { data: payments, pagination, error } = useSelector(selectDataList);

  const [filters, setFilters] = useState<ReceiptPaymentFilterDto>({
    page: 1,
    limit: 10,
  });

  const [paginationData, setPaginationData] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pagination.limit || 10,
  });

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchPayments = useCallback(() => {
    const params = {
      page: paginationData.pageIndex + 1,
      limit: paginationData.pageSize,
      ...filters,
    };
    const cleanedParams = cleanObject(params);
    dispatch(getReceiptPaymentList(cleanedParams));
  }, [dispatch, filters, paginationData]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Search functionality
  const filterSearchData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim();
    setFilters(prev => ({
      ...prev,
      keyword,
      page: 1,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
    });

    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // Delete functionality
  const deleteToggle = () => setDeleteModal(!deleteModal);

  const onClickDelete = (payment: any) => {
    setDeleteModal(true);
    setSelectedPayment(payment);
  };

  const handleDelete = () => {
    if (selectedPayment) {
      dispatch(deleteReceiptPayment(selectedPayment.id));
      setDeleteModal(false);
      setSelectedPayment(null);
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
            className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600"
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
          return date ? formatDateTime(date, true) : '-';
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
          return value || supplier?.name || "-";
        },
      },
      {
        header: "Số tiền",
        accessorKey: "amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <span className="font-semibold text-slate-700 dark:text-zink-100">
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
            <span className="text-sm text-slate-500 dark:text-zink-200">
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
                  className="block w-full px-4 py-1.5 text-base transition-all duration-200 ease-linear text-left text-slate-600 hover:bg-slate-100 hover:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200"
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

  // Summary calculations
  const summary = useMemo(() => {
    const totalPayments = payments.length;
    const totalDebt = payments
      .filter((p: any) => p.status === ReceiptPaymentStatus.DEBT_PAYMENT)
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    return { totalPayments, totalDebt };
  }, [payments]);

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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 mb-5">
        <div className="lg:col-span-4">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
              placeholder="Tìm kiếm theo mã phiếu, đối tượng chi..."
              autoComplete="off"
              onChange={debounce(filterSearchData, 700)}
            />
            <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
          </div>
        </div>

        <div className="lg:col-span-6">
          <ReceiptPaymentFilters filters={filters} setFilters={setFilters} />
        </div>

        <div className="lg:col-span-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
              onClick={resetFilters}
            >
              Xóa lọc
            </button>
            <Link
              to="/receipt-payment/create"
              className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600"
            >
              <Plus className="inline-block size-4" />
              <span className="align-middle">Tạo phiếu chi</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-5">
        <div className="p-4 bg-slate-50 dark:bg-zink-600 rounded-md">
          <div className="text-sm text-slate-500 dark:text-zink-200">Tổng số phiếu</div>
          <div className="text-xl font-semibold text-slate-700 dark:text-zink-100">
            {summary.totalPayments}
          </div>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-md">
          <div className="text-sm text-red-500">Tổng Nợ Chi</div>
          <div className="text-xl font-semibold text-red-600">
            {formatMoney(summary.totalDebt)}
          </div>
        </div>
      </div>

      {/* Table */}
      {payments && payments.length > 0 ? (
        <TableCustom
          isPagination={true}
          columns={columns}
          data={payments}
          totalData={pagination.totalItems}
          pageCount={pagination.totalPages}
          pagination={paginationData}
          setPaginationData={setPaginationData}
          customPageSize={10}
          divclassName="mt-5"
          tableclassName="w-full whitespace-nowrap"
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