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
import {
  FileEdit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Download,
} from "lucide-react";
import debounce from "lodash.debounce";
import { FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import BreadCrumb from "Common/BreadCrumb";
import DeleteModal from "Common/DeleteModal";
import { Dropdown } from "Common/Components/Dropdown";
import TableContainer from "Common/TableContainer";
import { NoTableResult } from "Common/Components/NoTableResult";
import {
  CUSTOMER_STATUS,
  CUSTOMER_GROUP,
} from "Common/constants/customer-constant";
import ImportCustomerModal from "../components/ImportCustomerModal";
import CustomerFormModal from "../components/CustomerFormModal";
import {
  getCustomersThunk,
  addCustomerThunk,
  updateCustomerThunk,
  deleteCustomerThunk,
} from "slices/customer/thunk";
import { formatMoney, isHasKey } from "helpers/utils";
import { resetMessage } from "slices/customer/reducer";

import "./CustomerList.css";

interface CustomerFormData {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  taxCode?: string;
  company?: string;
  address?: string;
  note?: string;
  type: string;
  status: string;
}

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: CUSTOMER_STATUS.ACTIVE, label: "Hoạt động" },
  { value: CUSTOMER_STATUS.INACTIVE, label: "Không hoạt động" },
];

const groupOptions = [
  { value: "", label: "Tất cả nhóm" },
  { value: CUSTOMER_GROUP.INDIVIDUAL, label: "Cá nhân" },
  { value: CUSTOMER_GROUP.BUSINESS, label: "Công ty" },
];

const CustomerList = () => {
  const dispatch = useDispatch<any>();

  const [show, setShow] = useState<boolean>(false);
  const [eventData, setEventData] = useState<any>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [importModal, setImportModal] = useState<boolean>(false);
  const [fileImport, setFileImport] = useState<any>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const importInputFile = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectCustomerList = createSelector(
    (state: any) => state.Customer,
    (customer) => ({
      customers: customer.customers,
      pagination: customer.pagination,
      message: customer.message,
    })
  );

  const { customers, pagination, message } = useSelector(selectCustomerList);

  // const selectLayoutState = createSelector(
  //   (state: any) => state.Layout,
  //   (layout) => ({
  //     sidebarVisibilitytype: layout.sidebarVisibilitytype,
  //   })
  // );

  // const { sidebarVisibilitytype } = useSelector(selectLayoutState);

  // Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (eventData && eventData.id) || "",
      name: (eventData && eventData.name) || "",
      type: (eventData && eventData.type) || CUSTOMER_GROUP.INDIVIDUAL,
      company: (eventData && eventData.company) || "",
      phone: (eventData && eventData.phone) || "",
      email: (eventData && eventData.email) || "",
      taxCode: (eventData && eventData.taxCode) || "",
      address: (eventData && eventData.address) || "",
      note: (eventData && eventData.note) || "",
      status: (eventData && eventData.status) || CUSTOMER_STATUS.ACTIVE,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập tên khách hàng"),
      phone: Yup.string()
        .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
        .nullable(),
      email: Yup.string().email("Email không hợp lệ").nullable(),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        dispatch(updateCustomerThunk(values));
      } else {
        dispatch(addCustomerThunk(values));
      }
      toggle();
    },
  });

  // Fetch customers
  const fetchCustomers = useCallback(() => {
    const params = {
      page: currentPage,
      limit: perPage,
      keyword: searchKeyword,
      status: statusFilter,
      type: groupFilter,
    };
    dispatch(getCustomersThunk(params));
  }, [
    dispatch,
    currentPage,
    perPage,
    searchKeyword,
    statusFilter,
    groupFilter,
  ]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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

  // Delete functions
  const onClickDelete = (customer: any) => {
    setDeleteModal(true);
    setEventData(customer);
  };

  const handleDelete = () => {
    if (eventData) {
      dispatch(deleteCustomerThunk(eventData.id));
      setDeleteModal(false);
    }
  };

  const deleteToggle = () => setDeleteModal(!deleteModal);

  // Update functions
  const handleUpdateDataClick = (customer: any) => {
    setEventData({ ...customer });
    setIsEdit(true);
    setShow(true);
  };

  // Modal toggle
  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setEventData("");
      setIsEdit(false);
    } else {
      setShow(true);
      setEventData("");
      validation.resetForm();
    }
  }, [show, validation]);

  // Import functions
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

      if (!["xlsx", "xls"].includes(fileType.toLowerCase())) {
        toast.error("Vui lòng chọn file Excel (.xlsx, .xls)");
        return;
      }

      setFileImport(file);
      setImportModal(true);

      const button: any = importInputFile.current;
      if (importInputFile && button) {
        button.value = "";
      }
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        header: "Mã KH",
        accessorKey: "customerCode",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const data = cell.row.original;
          return (
            <Link
              to={`/customers/${data.id}`}
              className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600 user-id"
              onClick={() => handleUpdateDataClick(data)}
            >
              {cell.getValue()}
            </Link>
          );
        },
      },
      {
        header: "Loại khách",
        accessorKey: "type",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const type = cell.getValue();
          const typeLabels = {
            [CUSTOMER_GROUP.INDIVIDUAL]: "Cá nhân",
            [CUSTOMER_GROUP.BUSINESS]: "Công ty",
          };
          return typeLabels[type as CUSTOMER_GROUP] || type;
        },
      },
      {
        header: "Tên khách",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="flex items-center gap-2">
            <div className="grow">
              <h6 className="mb-1">
                <Link
                  to={`/customers/${cell.row.original.id}`}
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
        header: "MST",
        accessorKey: "taxCode",
        enableColumnFilter: false,
      },
      {
        header: "Công nợ hiện tại",
        accessorKey: "totalDebt",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const value = cell.getValue();
          return formatMoney(value);
        },
      },
      {
        header: "Tổng giao dịch đã bán",
        accessorKey: "totalPaid",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const value = cell.getValue();
          return formatMoney(value);
        },
      },
      {
        header: "Tổng giao dịch trả hàng",
        accessorKey: "totalReturn",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const value = cell.getValue();
          return formatMoney(value);
        },
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const status = cell.getValue();
          const getStatusBadge = (status: number | string) => {
            const statusValue = Number(status);
            if (statusValue === 1) {
              return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Hoạt động
                </span>
              );
            } else if (statusValue === 0) {
              return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  Không hoạt động
                </span>
              );
            }
            return status;
          };
          return getStatusBadge(status);
        },
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <Dropdown
            className={`relative dropdown-customer-action ${
              cell.row.index >= 7 ? "dropdown-bottom" : ""
            }`}
          >
            <Dropdown.Trigger
              className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20"
              id="customersAction1"
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
                  data-modal-target="addCustomerModal"
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
                    const customerData = cell.row.original;
                    onClickDelete(customerData);
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
      <BreadCrumb title="Danh sách khách hàng" pageTitle="Customers" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ImportCustomerModal
        show={importModal}
        file={fileImport}
        onCancel={() => setImportModal(false)}
        onDone={fetchCustomers}
      />
      <div className="card" id="customerList">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tìm kiếm khách hàng..."
                  autoComplete="off"
                  onChange={handleSearchChange}
                />
                <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
              </div>
            </div>
            <div className="xl:col-span-2">
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
            </div>
            <div className="xl:col-span-2">
              <div>
                <select
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800"
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                >
                  {groupOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="xl:col-span-2">
              <button
                type="button"
                className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                onClick={() => {
                  setSearchKeyword("");
                  setStatusFilter("");
                  setGroupFilter("");
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
            <div className="xl:col-span-3">
              <div className="flex gap-2 xl:justify-end">
                <button
                  type="button"
                  className="bg-white border-dashed text-custom-500 btn border-custom-500 hover:text-custom-500 hover:bg-custom-50 hover:border-custom-600 focus:text-custom-600 focus:bg-custom-50 focus:border-custom-600 active:text-custom-600 active:bg-custom-50 active:border-custom-600 dark:bg-zink-700 dark:ring-custom-400/20 dark:hover:bg-custom-800/20 dark:focus:bg-custom-800/20 dark:active:bg-custom-800/20"
                  onClick={onClickImportFile}
                >
                  <Download className="inline-block size-4" />{" "}
                  <span className="align-middle">Nhập Excel</span>
                </button>
                <input
                  ref={importInputFile}
                  type="file"
                  accept=".xlsx,.xls"
                  style={{ display: "none" }}
                  onChange={handleImportFileUpload}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                    onClick={toggle}
                  >
                    <Plus className="inline-block size-4" />{" "}
                    <span className="align-middle">Thêm mới</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" id="customerTable">
        <div className="card-body">
          {customers && customers.length > 0 ? (
            <TableContainer
              isPagination={true}
              columns={columns}
              data={customers || []}
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

      {/* Replace the existing modal with the new component */}
      <CustomerFormModal
        show={show}
        onHide={toggle}
        isEdit={isEdit}
        validation={validation as FormikProps<CustomerFormData>}
      />
    </React.Fragment>
  );
};

export default CustomerList;
