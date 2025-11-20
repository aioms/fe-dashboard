import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import BreadCrumb from "Common/BreadCrumb";
import debounce from "lodash.debounce";

// icons
import {
  Boxes,
  Loader,
  Search,
  PackageCheck,
  PackageX,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { Link } from "react-router-dom";

import DeleteModal from "Common/DeleteModal";

// react-redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import {
  getReceiptImportList as onGetReceiptImportList,
  deleteReceiptImport as onDeleteReceiptImport,
  getReceiptImportByReceiptNumber as onGetReceiptImportInfo,
} from "slices/thunk";
import { ToastContainer } from "react-toastify";
import { PaginationState } from "@tanstack/react-table";
import PrintMultipleBarcodeModal from "../components/PrintMultipleBarcodeModal";
import PrintSingleBarcodeModal from "../components/PrintSingleBarcodeModal";
import { TimePicker } from "Common/Components/TimePIcker";
import { getDate } from "helpers/date";
import { NoTableResult } from "Common/Components/NoTableResult";
import ExpandableReceiptTable from "./components/ExpandableReceiptTable";

const ReceiptImportList = () => {
  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.ReceiptImport,
    (state) => ({
      data: state?.data || [],
      pagination: state?.pagination || {},
    })
  );

  const { data: receipts, pagination } = useSelector(selectDataList);

  const [eventData, setEventData] = useState<any>({ receiptNumber: "" });
  const [filters, setFilters] = useState<Record<string, string | number>>({});

  const [paginationData, setPaginationData] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pagination.limit || 10,
  });

  const selectDataReceipt = createSelector(
    (state: any) => state.ReceiptImport,
    (state) => ({
      receiptInfo: state.receiptInfo || {},
      receiptItems: state.receiptItems || [],
    })
  );

  const { receiptItems } = useSelector(selectDataReceipt);

  useEffect(() => {
    if (!eventData.receiptNumber) return;
    dispatch(onGetReceiptImportInfo(eventData.receiptNumber));
  }, [dispatch, eventData.receiptNumber]);

  const fetchReceipts = useCallback(() => {
    dispatch(
      onGetReceiptImportList({
        page: paginationData.pageIndex + 1,
        limit: paginationData.pageSize,
        ...filters,
      })
    );
  }, [dispatch, filters, paginationData]);

  // Get Data
  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  // Modals
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [showPrintMultipleModal, setShowPrintMultipleModal] =
    useState<boolean>(false);
  const [showPrintSingleModal, setShowPrintSingleModal] =
    useState<boolean>(false);

  const showPrintMultipleModalToggle = () =>
    setShowPrintMultipleModal(!showPrintMultipleModal);

  const showPrintSingleModalToggle = () =>
    setShowPrintSingleModal(!showPrintSingleModal);

  const deleteToggle = () => setDeleteModal(!deleteModal);

  // Delete Data
  const onClickDelete = (cell: any) => {
    setDeleteModal(true);

    if (cell.id) {
      setEventData(cell);
    }
  };

  const handleDelete = () => {
    if (eventData) {
      dispatch(onDeleteReceiptImport(eventData.id));
      setDeleteModal(false);
    }
  };

  const onClickShowPrintMultiple = (cell: any) => {
    setShowPrintMultipleModal(true);

    if (cell.receiptNumber) {
      setEventData(cell);
    }
  };

  const onClickShowPrintSingle = (cell: any) => {
    setShowPrintSingleModal(true);

    if (cell.receiptNumber) {
      setEventData(cell);
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update filterSearchData to apply trim()
  const filterSearchData = (e: any) => {
    const keyword = e.target.value.trim();
    setFilters((prev) => ({
      ...prev,
      keyword,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      keyword: "",
      importDate: "",
      status: "",
      page: 1,
    }));

    // Clear search input
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab: any, type: any) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      const status = type === "all" ? "" : type;

      setFilters((prev) => ({
        ...prev,
        status,
        page: 1,
      }));
    }
  };



  return (
    <React.Fragment>
      <BreadCrumb title="Danh sách phiếu nhập" pageTitle="Phiếu nhập" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />

      {eventData?.receiptNumber ? (
        showPrintMultipleModal ? (
          <PrintMultipleBarcodeModal
            show={showPrintMultipleModal}
            onClose={showPrintMultipleModalToggle}
            receiptItems={receiptItems}
          />
        ) : (
          <PrintSingleBarcodeModal
            show={showPrintSingleModal}
            onClose={showPrintSingleModalToggle}
            barcode={eventData.receiptNumber}
          />
        )
      ) : null}

      <ToastContainer closeButton={false} limit={1} />

      <div className="card" id="ordersTable">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp ..."
                  autoComplete="off"
                  onChange={debounce(filterSearchData, 700)}
                />
                <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <TimePicker
                value={filters.importDate as string}
                onChange={([date]) => {
                  setFilters((prev) => ({
                    ...prev,
                    importDate: getDate(date).toISOString(),
                    page: 1,
                  }));
                }}
                props={{
                  placeholder: "Chọn ngày nhập hàng",
                  id: "importDate",
                }}
              />
            </div>
            <div className="lg:col-span-2">
              <button
                type="button"
                className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                onClick={resetFilters}
              >
                Xóa lọc
                <i className="align-baseline ltr:pl-1 rtl:pr-1 ri-close-line"></i>
              </button>
            </div>
            <div className="lg:col-span-2 lg:col-start-11">
              <div className="ltr:lg:text-right rtl:lg:text-left">
                <Link
                  to="/receipt-import/create"
                  className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                >
                  <Plus className="inline-block size-4" />{" "}
                  <span className="align-middle">Tạo phiếu</span>
                </Link>
              </div>
            </div>
          </div>

          <ul className="flex flex-wrap w-full mt-5 text-sm font-medium text-center text-gray-500 nav-tabs">
            <li className={`group ${activeTab === "1" && "active"}`}>
              <Link
                to="#"
                data-tab-toggle
                data-target="allOrders"
                className="inline-block px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                onClick={() => {
                  toggleTab("1", "all");
                }}
              >
                <Boxes className="inline-block size-4 ltr:mr-1 rtl:ml-1" />{" "}
                <span className="align-middle">Tất cả</span>
              </Link>
            </li>
            <li className={`group ${activeTab === "2" && "active"}`}>
              <Link
                to="#"
                data-tab-toggle
                data-target="pendingOrder"
                className="inline-block px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                onClick={() => {
                  toggleTab("2", "processing");
                }}
              >
                <Loader className="inline-block size-4 ltr:mr-1 rtl:ml-1" />{" "}
                <span className="align-middle">Đang xử lý</span>
              </Link>
            </li>
            <li className={`group ${activeTab === "3" && "active"}`}>
              <Link
                to="#"
                data-tab-toggle
                data-target="deliveredOrder"
                className="inline-block px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                onClick={() => {
                  toggleTab("3", "completed");
                }}
              >
                <PackageCheck className="inline-block size-4 ltr:mr-1 rtl:ml-1" />{" "}
                <span className="align-middle">Hoàn thành</span>
              </Link>
            </li>
            <li className={`group ${activeTab === "4" && "active"}`}>
              <Link
                to="#"
                data-tab-toggle
                data-target="returnsOrders"
                className="inline-block px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                onClick={() => {
                  toggleTab("4", "short_received");
                }}
              >
                <RefreshCcw className="inline-block size-4 ltr:mr-1 rtl:ml-1" />{" "}
                <span className="align-middle">Giao thiếu</span>
              </Link>
            </li>
            <li className={`group ${activeTab === "5" && "active"}`}>
              <Link
                to="#"
                data-tab-toggle
                data-target="returnsOrders"
                className="inline-block px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                onClick={() => {
                  toggleTab("5", "over_received");
                }}
              >
                <RefreshCcw className="inline-block size-4 ltr:mr-1 rtl:ml-1" />{" "}
                <span className="align-middle">Giao dư</span>
              </Link>
            </li>
            <li className={`group ${activeTab === "6" && "active"}`}>
              <Link
                to="#"
                data-tab-toggle
                data-target="cancelledOrders"
                className="inline-block px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                onClick={() => {
                  toggleTab("6", "cancelled");
                }}
              >
                <PackageX className="inline-block size-4 ltr:mr-1 rtl:ml-1 " />{" "}
                <span className="align-middle">Hủy bỏ</span>
              </Link>
            </li>
          </ul>

          {receipts && receipts.length > 0 ? (
            <>
              <ExpandableReceiptTable
                receipts={receipts}
                onClickDelete={onClickDelete}
                onClickShowPrintSingle={onClickShowPrintSingle}
                onClickShowPrintMultiple={onClickShowPrintMultiple}
                onExportCSV={() => {
                  // TODO: Implement CSV export functionality
                  console.log("Export CSV clicked");
                }}
              />
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col items-center mt-5 md:flex-row">
                  <div className="mb-4 grow md:mb-0">
                    <div className="text-slate-500 dark:text-zink-200">
                      Hiển trị <b>{paginationData.pageSize}</b> kết quả trên tổng{" "}
                      <b>{pagination.totalItems}</b> dữ liệu
                    </div>
                  </div>
                  <ul className="flex flex-wrap items-center gap-2 shrink-0">
                    <li>
                      <button
                        className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 ${
                          paginationData.pageIndex === 0 ? "disabled opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                          if (paginationData.pageIndex > 0) {
                            setPaginationData({ ...paginationData, pageIndex: 0 });
                          }
                        }}
                        disabled={paginationData.pageIndex === 0}
                      >
                        Trang đầu
                      </button>
                    </li>
                    <li>
                      <button
                        className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 ${
                          paginationData.pageIndex === 0 ? "disabled opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                          if (paginationData.pageIndex > 0) {
                            setPaginationData({
                              ...paginationData,
                              pageIndex: paginationData.pageIndex - 1,
                            });
                          }
                        }}
                        disabled={paginationData.pageIndex === 0}
                      >
                        Trang trước
                      </button>
                    </li>
                    <li>
                      <span className="inline-flex items-center justify-center bg-custom-50 dark:bg-custom-500/10 h-8 px-3 border rounded border-custom-500 text-custom-500">
                        {paginationData.pageIndex + 1} / {pagination.totalPages}
                      </span>
                    </li>
                    <li>
                      <button
                        className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 ${
                          paginationData.pageIndex >= pagination.totalPages - 1
                            ? "disabled opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (paginationData.pageIndex < pagination.totalPages - 1) {
                            setPaginationData({
                              ...paginationData,
                              pageIndex: paginationData.pageIndex + 1,
                            });
                          }
                        }}
                        disabled={paginationData.pageIndex >= pagination.totalPages - 1}
                      >
                        Trang sau
                      </button>
                    </li>
                    <li>
                      <button
                        className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 ${
                          paginationData.pageIndex >= pagination.totalPages - 1
                            ? "disabled opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (paginationData.pageIndex < pagination.totalPages - 1) {
                            setPaginationData({
                              ...paginationData,
                              pageIndex: pagination.totalPages - 1,
                            });
                          }
                        }}
                        disabled={paginationData.pageIndex >= pagination.totalPages - 1}
                      >
                        Trang cuối
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <NoTableResult />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReceiptImportList;
