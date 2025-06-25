import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import lodash from "lodash";

// Icons
import {
  Search,
  Trash2,
  Plus,
  MoreHorizontal,
  FileEdit,
  Download,
} from "lucide-react";
import DeleteModal from "Common/DeleteModal";

import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { toast } from "react-toastify";

import {
  getSuppliersThunk as onGetSuppliers,
  addSupplierThunk as onAddSupplier,
  updateSupplierThunk as onUpdateSupplier,
  deleteSupplierThunk as onDeleteSupplier,
} from "slices/thunk";
import { resetMessage } from "slices/supplier/reducer";

import BreadCrumb from "Common/BreadCrumb";
import { Dropdown } from "Common/Components/Dropdown";
import { SUPPLIER_STATUS } from "Common/constants/supplier-constant";
import { SupplierStatusBadge } from "../components/SupplierStatus";
import { NoTableResult } from "Common/Components/NoTableResult";
import TableContainer from "Common/TableContainer";
import ImportSupplierModal from "../components/ImportSupplierModal";
import AddEditSupplierModal from "./components/AddEditSupplierModal";

import "./SupplierList.css";
import { isHasKey } from "helpers/utils";

const statusOptions = [
  { value: "status", label: "Trạng thái" },
  { value: SUPPLIER_STATUS.COLLABORATING, label: "Đang hợp tác" },
  { value: SUPPLIER_STATUS.PAUSED, label: "Tạm dừng" },
  { value: SUPPLIER_STATUS.STOPPED_COLLABORATING, label: "Ngừng hợp tác" },
];

const SupplierList = () => {
  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.Supplier,
    (state) => ({
      suppliers: state.suppliers || [],
      pagination: state.pagination || {},
      message: state.message || {},
    })
  );

  const { suppliers, message, pagination } = useSelector(selectDataList);

  const [eventData, setEventData] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState(statusOptions[0]);

  // Import excel
  const [fileImport, setFileImport] = useState(null);
  const importInputFile = useRef(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modal
  const [importModal, setImportModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const importModalToggle = () => setImportModal(!importModal);
  const deleteToggle = () => setDeleteModal(!deleteModal);

  const fetchSuppliers = useCallback(() => {
    dispatch(
      onGetSuppliers({
        page: currentPage,
        limit: perPage,
        ...filters,
      })
    );
  }, [dispatch, currentPage, perPage, filters]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

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

  // Delete Data
  const onClickDelete = (cell: any) => {
    setDeleteModal(true);

    if (cell.id) {
      setEventData(cell);
    }
  };

  const handleDelete = () => {
    if (eventData) {
      dispatch(onDeleteSupplier(eventData.id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleUpdateDataClick = (elem: any) => {
    setEventData({ ...elem });
    setIsEdit(true);
    setShow(true);
  };

  // Filter Data
  const filterSearchData = (e: any) => {
    const keyword = e.target.value;
    setFilters((prev) => ({
      ...prev,
      keyword: keyword.trim(),
      page: 1,
    }));
  };

  const filterStatusData = (event: any) => {
    setStatusFilter(event);
    if (event.value === "status") {
      setFilters((prev) => ({
        ...prev,
        status: "",
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        status: event.value,
      }));
    }
  };

  const resetFilters = () => {
    setFilters({ status: "", keyword: "" });
    setStatusFilter(statusOptions[0]);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (values: Record<string, string | number>) => {
    if (isEdit) {
      const dataUpdate = {
        id: eventData ? eventData.id : 0,
        ...values,
      };
      dispatch(onUpdateSupplier(dataUpdate));
    } else {
      dispatch(onAddSupplier({ ...values }));
    }
    toggle();
  };

  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setEventData("");
      setIsEdit(false);
    } else {
      setShow(true);
      setEventData("");
    }
  }, [show]);

  const onClickImportFile = () => {
    const button: any = importInputFile.current;
    if (importInputFile && button) {
      button.click();
    }
  };

  const handleImportFileUpload = (e: any) => {
    const { files } = e.target;

    if (files && files.length) {
      const filename = files[0].name;
      const file = files[0];

      var parts = filename.split(".");
      const fileType = parts[parts.length - 1];
      console.log("fileType", fileType); //ex: zip, rar, jpg, svg etc.

      setFileImport(file);
      setImportModal(true);

      const button: any = importInputFile.current;
      if (importInputFile && button) {
        button.value = "";
      }
    }
  };

  const columns = useMemo(
    () => [
      // {
      //   header: (
      //     <div className="flex items-center h-full">
      //       <input
      //         id="CheckboxAll"
      //         className="size-4 bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800 cursor-pointer"
      //         type="checkbox"
      //       />
      //     </div>
      //   ),
      //   enableSorting: false,
      //   id: "checkAll",
      //   cell: (_cell: any) => {
      //     return (
      //       <div className="flex items-center h-full">
      //         <input
      //           id="Checkbox1"
      //           className="size-4 bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800 cursor-pointer"
      //           type="checkbox"
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        header: "ID",
        accessorKey: "code",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const data = cell.row.original;
          return (
            <Link
              to={`/suppliers/${data.id}`}
              className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600 user-id"
              onClick={() => handleUpdateDataClick(data)}
            >
              {cell.getValue()}
            </Link>
          );
        },
      },
      {
        header: "Tên nhà cung cấp",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="flex items-center gap-2">
            <div className="grow">
              <h6 className="mb-1">
                <Link
                  to={`/suppliers/${cell.row.original.id}`}
                  className="name transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600"
                >
                  {cell.getValue()}
                </Link>
              </h6>
            </div>
          </div>
        ),
      },
      {
        header: "Công ty",
        accessorKey: "company",
        enableColumnFilter: false,
      },
      {
        header: "Mã số thuế",
        accessorKey: "taxCode",
        enableColumnFilter: false,
      },
      {
        header: "Số điện thoại",
        accessorKey: "phone",
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Công nợ hiện tại",
        accessorKey: "currentDebt",
        enableColumnFilter: false,
      },
      {
        header: "Tổng đã mua",
        accessorKey: "totalPurchased",
        enableColumnFilter: false,
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => <SupplierStatusBadge status={cell.getValue()} />,
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <Dropdown className="relative">
            <Dropdown.Trigger
              className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20"
              id="usersAction1"
            >
              <MoreHorizontal className="size-3" />
            </Dropdown.Trigger>
            <Dropdown.Content
              placement="bottom-start"
              className="absolute z-[1001] py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-lg border border-slate-200 min-w-[10rem] dark:bg-zink-600 dark:border-zink-500 transform -translate-x-full"
              aria-labelledby="customersAction1"
            >
              <li>
                <Link
                  data-modal-target="addUserModal"
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                  to="#!"
                  onClick={() => {
                    const data = cell.row.original;
                    handleUpdateDataClick(data);
                  }}
                >
                  <FileEdit className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "}
                  <span className="align-middle">Cập nhật</span>
                </Link>
              </li>
              <li>
                <Link
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                  to="#!"
                  onClick={() => {
                    const orderData = cell.row.original;
                    onClickDelete(orderData);
                  }}
                >
                  <Trash2 className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "}
                  <span className="align-middle">Xóa</span>
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
      <BreadCrumb title="Danh sách nhà cung cấp" pageTitle="Suppliers" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ImportSupplierModal
        show={importModal}
        file={fileImport}
        onCancel={importModalToggle}
        onDone={fetchSuppliers}
      />
      <AddEditSupplierModal
        show={show}
        onHide={toggle}
        isEdit={isEdit}
        eventData={eventData}
        onSubmit={handleFormSubmit}
      />

      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="suppliersTable">
            {/* <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-15 grow">Danh sách người dùng</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                    onClick={toggle}
                  >
                    <Plus className="inline-block size-4" />{" "}
                    <span className="align-middle">Tạo mới</span>
                  </button>
                </div>
              </div>
            </div> */}
            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <form action="#!">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                  <div className="relative xl:col-span-3">
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Tìm họ tên, số điện thoại,..."
                      autoComplete="off"
                      onChange={lodash.debounce(filterSearchData, 700)}
                    />
                    <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                  </div>
                  <div className="xl:col-span-2">
                    <Select
                      className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      options={statusOptions}
                      isSearchable={false}
                      value={statusFilter}
                      onChange={filterStatusData}
                    />
                  </div>
                  <div className="xl:col-span-2">
                    <button
                      type="button"
                      className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                      onClick={resetFilters}
                    >
                      Xóa lọc
                      <i className="align-baseline ltr:pl-1 rtl:pr-1 ri-close-line"></i>
                    </button>
                  </div>
                  {/* <div className="xl:col-span-2 xl:col-end-13">
                    <div className="xl:justify-end flex">
                      <button
                        type="button"
                        className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                        onClick={toggle}
                      >
                        <Plus className="inline-block size-4" />{" "}
                        <span className="align-middle">Tạo mới</span>
                      </button>
                    </div>
                  </div> */}
                  <div className="xl:col-span-3 xl:col-start-10">
                    <div className="flex gap-2 xl:justify-end">
                      <div>
                        <input
                          style={{ display: "none" }}
                          accept=".xlsx,.xls,.csv"
                          ref={importInputFile}
                          onChange={handleImportFileUpload}
                          type="file"
                        />
                        <button
                          type="button"
                          className="bg-white border-dashed text-custom-500 btn border-custom-500 hover:text-custom-500 hover:bg-custom-50 hover:border-custom-600 focus:text-custom-600 focus:bg-custom-50 focus:border-custom-600 active:text-custom-600 active:bg-custom-50 active:border-custom-600 dark:bg-zink-700 dark:ring-custom-400/20 dark:hover:bg-custom-800/20 dark:focus:bg-custom-800/20 dark:active:bg-custom-800/20"
                          onClick={onClickImportFile}
                        >
                          <Download className="inline-block size-4" />{" "}
                          <span className="align-middle">Nhập Excel</span>
                        </button>
                      </div>
                      <div className="xl:justify-end flex">
                        <button
                          type="button"
                          className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                          onClick={toggle}
                        >
                          <Plus className="inline-block size-4" />{" "}
                          <span className="align-middle">Tạo mới</span>
                        </button>
                      </div>
                      {/* <button className="flex items-center justify-center size-[37.5px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20">
                        <SlidersHorizontal className="size-4" />
                      </button> */}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="card-body">
              {suppliers && suppliers.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={suppliers || []}
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default SupplierList;
