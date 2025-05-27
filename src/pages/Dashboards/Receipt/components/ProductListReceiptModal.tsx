import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  FC,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import { PaginationState } from "@tanstack/react-table";
import Select from "react-select";
import debounce from "lodash.debounce";

// react-redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Icon
import { Plus, Search } from "lucide-react";

import Modal from "Common/Components/Modal";
import TableCustom from "Common/TableCustom";

import { getProductList as onGetProductList } from "slices/thunk";

import CreateProductModal from "./CreateProductModal";
import { formatMoney } from "helpers/utils";
import { PRODUCT_STATUS } from "Common/constants/product-constant";
import { ProductStatus } from "pages/Dashboards/Product/components/ProductStatus";

const optionsFilterStatus: any = [
  { value: "status", label: "Trạng thái" },
  { value: PRODUCT_STATUS.DRAFT, label: "Nháp" },
  { value: PRODUCT_STATUS.ACTIVE, label: "Hoạt động" },
  { value: PRODUCT_STATUS.INACTIVE, label: "Không hoạt động" },
];

const PAGE_SIZE = 50;

interface Props {
  show: boolean;
  isCreateNew?: boolean;
  selectedItems?: any[];
  onCancel: () => void;
  onDone?: (items: any) => void;
}

const ProductListReceiptModal: FC<Props> = ({
  selectedItems,
  isCreateNew,
  show,
  onCancel,
  onDone,
}) => {
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
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedItems || !selectedItems.length) return;
    setSelectedRows(selectedItems);
  }, [selectedItems]);

  // Modals
  const [createProductModal, setCreateProductModal] = useState<boolean>(false);

  const [paginationData, setPaginationData] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const handleCheckboxChange = (row: any) => {
    setSelectedRows((prev) => {
      const isExists = prev.find((selected) => selected.id === row.id);

      if (isExists) {
        // Remove if already selected
        return prev.filter((selected) => selected.id !== row.id);
      } else {
        // Add if not selected
        return [...prev, row];
      }
    });
  };

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

  const createProductModalToggle = () => {
    setCreateProductModal(!createProductModal);
    setEventData({});
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

  const resetFilters = () => {
    setFilters({ status: "", keyword: "" });

    if (inputSearchRef.current) {
      inputSearchRef.current.value = "";
    }
  };

  const handleConfirm = () => {
    onDone && onDone(selectedRows);
    onCancel();
  };

  const columns = useMemo(
    () => [
      {
        // header: () => (
        //   <div className="flex items-center h-full">
        //     <input
        //       className="size-4 cursor-pointer bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800"
        //       type="checkbox"
        //       onChange={() => {
        //         handleCheckAll();
        //       }}
        //     />
        //   </div>
        // ),
        accessorKey: "#",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <>
            <div className="flex items-center h-full">
              <input
                className="size-4 cursor-pointer bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800"
                type="checkbox"
                checked={
                  !!selectedRows.find(
                    (row) =>
                      row.code?.toString() ===
                      cell.row?.original?.code?.toString()
                  )
                }
                onChange={() => {
                  const { id, code, productName, costPrice, inventory } =
                    cell.row.original;

                  handleCheckboxChange({
                    id,
                    code: code,
                    name: productName,
                    price: costPrice,
                    inventory: inventory,
                  });
                }}
              />
            </div>
          </>
        ),
      },
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
        accessorKey: "supplier",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const value = cell.getValue();
          return value?.name ?? ''
        },
      },
      {
        header: "Mô tả",
        accessorKey: "additionalDescription",
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
    ],
    [selectedRows]
  );

  return (
    <React.Fragment>
      <Modal
        show={show}
        onHide={onCancel}
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen lg:w-[80rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500 dark:text-zink-200 dark:hover:text-red-500"
        >
          <h5 className="text-16">Chọn hàng hóa nhập</h5>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] min-h-[calc(theme('height.screen')_-_500px)] p-4 overflow-y-auto">
          {isCreateNew && (
            <CreateProductModal
              show={createProductModal}
              onCancel={createProductModalToggle}
              defaultData={eventData}
            />
          )}
          <div className="card">
            <div className="card-body">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12">
                <div className="xl:col-span-3">
                  <div className="relative">
                    <input
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Tìm mã, tên hàng,..."
                      autoComplete="off"
                      ref={inputSearchRef}
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
                    // defaultValue={optionsFilterStatus[0]}
                    value={
                      filters.status
                        ? {
                            label: optionsFilterStatus.find(
                              (opt: any) => opt.value === filters.status
                            )?.label,
                            value: filters.status,
                          }
                        : optionsFilterStatus[0]
                    }
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

                {isCreateNew && (
                  <div className="xl:col-span-5 flex justify-end">
                    <button
                      type="button"
                      className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                      onClick={() => setCreateProductModal(true)}
                    >
                      <Plus className="inline-block size-4" />{" "}
                      <span className="align-middle">Tạo mới</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* List Product */}
            <div className="!pt-1 card-body">
              {productList && productList.length > 0 ? (
                <TableCustom
                  isPagination={true}
                  columns={columns || []}
                  data={productList}
                  totalData={pagination.totalItems}
                  pageCount={pagination.totalPages}
                  pagination={paginationData}
                  setPaginationData={setPaginationData}
                  customPageSize={PAGE_SIZE}
                  divclassName="overflow-x-auto"
                  tableclassName="w-full whitespace-nowrap"
                  theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
                  thclassName="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500"
                  tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
                  PaginationClassName="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row"
                />
              ) : (
                <div className="noresult">
                  <div className="py-6 text-center">
                    <Search className="size-6 mx-auto mb-3 text-sky-500 fill-sky-100 dark:fill-sky-500/20" />
                    <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                    <p className="mb-0 text-slate-500 dark:text-zink-200">
                      We've searched more than 199+ product We did not find any
                      product for you search.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="flex items-center justify-end p-4 border-t border-slate-200 dark:border-zink-500">
          <div className="flex justify-between">
            <button
              type="reset"
              className="bg-white text-slate-500 btn hover:text-slate-500 hover:bg-slate-100 focus:text-slate-500 focus:bg-slate-100 active:text-slate-500 active:bg-slate-100 dark:bg-zink-600 dark:hover:bg-slate-500/10 dark:focus:bg-slate-500/10 dark:active:bg-slate-500/10 mr-2"
              onClick={onCancel}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              className="flex items-center text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
              onClick={handleConfirm}
            >
              Xác nhận
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default ProductListReceiptModal;