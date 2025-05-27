import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { PaginationState } from "@tanstack/react-table";
import Select from "react-select";
import debounce from "lodash.debounce";

// react-redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Icon
import {
  MoreHorizontal,
  Eye,
  FileEdit,
  Trash2,
  Search,
  Plus,
  Download,
} from "lucide-react";

import { Dropdown } from "Common/Components/Dropdown";
import TableCustom from "Common/TableCustom";
import DeleteModal from "Common/DeleteModal";
import BreadCrumb from "Common/BreadCrumb";

import {
  getProductList as onGetProductList,
  deleteProductList as onDeleteProductList,
} from "slices/thunk";

import ImportProductModal from "./components/ImportProductModal";
import CreateProductModal from "./components/CreateProductModal";
import PrintBarcodeModal from "./components/PrintBarcodeModal";
import { formatMoney } from "helpers/utils";
import { NoTableResult } from "Common/Components/NoTableResult";
import { PRODUCT_STATUS } from "Common/constants/product-constant";
import { ProductStatus } from "./components/ProductStatus";

import "./ProductList.css";

const optionsFilterStatus: any = [
  { value: "", label: "Trạng thái" },
  { value: PRODUCT_STATUS.DRAFT, label: "Nháp" },
  { value: PRODUCT_STATUS.ACTIVE, label: "Hoạt động" },
  { value: PRODUCT_STATUS.INACTIVE, label: "Không hoạt động" },
];

const ProductList = () => {
  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.Products,
    (state) => ({
      productList: state.productList || [],
      pagination: state.pagination || {},
    })
  );

  const { productList, pagination } = useSelector(selectDataList);

  const [eventData, setEventData] = useState<any>({});
  const [fileImport, setFileImport] = useState(null);
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const importInputFile = useRef(null);

  // Modals
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [importModal, setImportModal] = useState<boolean>(false);
  const [createProductModal, setCreateProductModal] = useState<boolean>(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState<boolean>(false);

  const [paginationData, setPaginationData] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pagination.limit || 10,
  });

  const fetchProducts = useCallback(() => {
    dispatch(
      onGetProductList({
        page: paginationData.pageIndex + 1,
        limit: paginationData.pageSize,
        ...filters,
      })
    );
  }, [dispatch, filters, paginationData]);

  // Get Data
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteToggle = () => setDeleteModal(!deleteModal);
  const importModalToggle = () => setImportModal(!importModal);
  const showBarcodeModalToggle = () => setShowBarcodeModal(!showBarcodeModal);
  const createProductModalToggle = () => {
    setCreateProductModal(!createProductModal);
    setEventData({});
  };

  const onClickCreateProduct = (cell: any) => {
    setCreateProductModal(true);

    if (cell.id) {
      setEventData(cell);
    }
  };

  const onClickShowBarcode = (cell: any) => {
    setShowBarcodeModal(true);

    if (cell.productCode) {
      setEventData(cell);
    }
  };

  const onClickDelete = (cell: any) => {
    setDeleteModal(true);

    if (cell.id) {
      setEventData(cell);
    }
  };

  const handleDelete = () => {
    if (eventData) {
      dispatch(onDeleteProductList(eventData.id));
      setDeleteModal(false);
    }
  };

  // Filter Data
  const filterSearchData = (e: any) => {
    const keyword = e.target.value;
    setFilters((prev) => ({
      ...prev,
      keyword,
      page: 1,
    }));
  };

  const filterStatusData = (event: any) => {
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

  const resetFilters = () => setFilters({ status: "" });

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
      {
        header: "Mã hàng hóa",
        accessorKey: "code",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link
            to="#"
            className="transition-all duration-150 ease-linear product_code text-custom-500 hover:text-custom-600"
          >
            {cell.getValue()}
          </Link>
        ),
      },
      {
        header: "Tên sản phẩm",
        accessorKey: "productName",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <h6 className="product_name">{cell.getValue()}</h6>
          // <Link
          //   to="/apps-ecommerce-product-overview"
          //   className="flex items-center gap-2"
          // >
          //   <img
          //     src={cell.row.original.img}
          //     alt="Product images"
          //     className="h-6"
          //   />
          // </Link>
        ),
      },
      {
        header: "Nhóm hàng hóa",
        accessorKey: "category",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <span className="category px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20 dark:text-zink-200">
            {cell.getValue()}
          </span>
        ),
      },
      {
        header: "Giá bán",
        accessorKey: "sellingPrice",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return formatMoney(cell.getValue());
        },
      },
      {
        header: "Giá vốn",
        accessorKey: "costPrice",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return formatMoney(cell.getValue());
        },
      },
      {
        header: "ĐVT",
        accessorKey: "unit",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Tồn kho",
        accessorKey: "inventory",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Nhà cung cấp",
        accessorKey: "suppliers",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const value = cell.getValue();
          const supplier = value
            .map((supplier: any) => supplier.name)
            .join(", ");
          return supplier;
        },
      },
      {
        header: "Mô tả",
        accessorKey: "description",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Cửa hàng",
        accessorKey: "warehouse",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => <ProductStatus status={cell.getValue()} />,
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <Dropdown
            className={`relative dropdown-product-action ${
              cell.row.index >= 7 ? "dropdown-bottom" : ""
            }`}
          >
            <Dropdown.Trigger
              className="flex items-center justify-center size-[30px] dropdown-toggle p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20"
              id={`productAction${cell.row.index}`}
              data-bs-toggle="dropdown"
            >
              <MoreHorizontal className="size-3" />
            </Dropdown.Trigger>
            <Dropdown.Content
              placement="right-end"
              className="absolute z-[1001] py-2 px-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-lg border border-slate-200 dropdown-menu min-w-[10rem] dark:bg-zink-600 dark:border-zink-500"
              aria-labelledby={`productAction${cell.row.index}`}
            >
              <li>
                <a
                  href="#!"
                  className="block px-4 py-2 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200 rounded-md mx-1"
                  onClick={() => {
                    const data = cell.row.original;
                    onClickShowBarcode(data);
                  }}
                >
                  <Eye className="inline-block size-4 ltr:mr-2 rtl:ml-2" />{" "}
                  <span className="align-middle">In tem mã</span>
                </a>
              </li>
              {/* <li> */}
              {/*   <Link */}
              {/*     className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" */}
              {/*     to="/apps-ecommerce-product-overview" */}
              {/*   > */}
              {/*     <Eye className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "} */}
              {/*     <span className="align-middle">Chi tiết</span> */}
              {/*   </Link> */}
              {/* </li> */}
              <li>
                <a
                  href="#!"
                  className="block px-4 py-2 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200 rounded-md mx-1"
                  onClick={() => onClickCreateProduct(cell.row.original)}
                >
                  <FileEdit className="inline-block size-4 ltr:mr-2 rtl:ml-2" />{" "}
                  <span className="align-middle">Cập nhật</span>
                </a>
              </li>
              <li>
                <Link
                  className="block px-4 py-2 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200 rounded-md mx-1"
                  to="#!"
                  onClick={() => onClickDelete(cell.row.original)}
                >
                  <Trash2 className="inline-block size-4 ltr:mr-2 rtl:ml-2" />{" "}
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
      <BreadCrumb title="Quản lý hàng hóa" pageTitle="Products" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ImportProductModal
        show={importModal}
        file={fileImport}
        onCancel={importModalToggle}
        onDone={fetchProducts}
      />
      <CreateProductModal
        show={createProductModal}
        onCancel={createProductModalToggle}
        defaultData={eventData}
      />
      <PrintBarcodeModal
        barcode={eventData.code}
        productName={eventData.productName}
        show={showBarcodeModal}
        onClose={showBarcodeModalToggle}
      />
      <div className="card" id="productListTable">
        <div className="card-body">
          <div className="flex items-center">
            <h6 className="text-15 grow">Danh sách hàng hóa</h6>
            <div className="shrink-0">
              <button
                type="button"
                className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                onClick={onClickCreateProduct}
              >
                <Plus className="inline-block size-4" />{" "}
                <span className="align-middle">Tạo mới</span>
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <div className="relative">
                <input
                  type="text"
                  className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tìm mã, tên hàng,..."
                  autoComplete="off"
                  onChange={debounce(filterSearchData, 700)}
                />
                <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
              </div>
            </div>
            <div className="xl:col-span-2">
              <Select
                className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                options={optionsFilterStatus}
                isSearchable={false}
                defaultValue={optionsFilterStatus[0]}
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
            <div className="lg:col-span-3 ltr:lg:text-right rtl:lg:text-left xl:col-span-3 xl:col-start-10">
              <div className="flex gap-2 xl:justify-end">
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
            </div>
          </div>
        </div>
        {/* List Product */}
        <div className="!pt-1 card-body">
          <div className="w-full overflow-x-auto">
            {productList && productList.length > 0 ? (
              <TableCustom
                isPagination={true}
                columns={columns || []}
                data={productList}
                totalData={pagination.totalItems}
                pageCount={pagination.totalPages}
                pagination={paginationData}
                setPaginationData={setPaginationData}
                customPageSize={10}
                divclassName="mt-5"
                tableclassName="w-full whitespace-nowrap min-w-[1000px]"
                theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
                thclassName="px-3.5 py-2.5 font-semibold text-slate-500 border-b border-slate-200 dark:border-zink-500 dark:text-zink-200"
                tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
                PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
              />
            ) : (
              <NoTableResult />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductList;
