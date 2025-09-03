import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Barcode from "react-barcode";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// react-redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Icons
import { Mail, PackageOpen, UserX2, Plus } from "lucide-react";
import withRouter from "Common/withRouter";
import ProductListReceiptModal from "../components/ProductListReceiptModal";
import { formatMoneyWithVND } from "helpers/utils";
import { getSuppliersThunk as onGetSupplierList } from "slices/thunk";
import { IHttpResponse } from "types";
import { request } from "helpers/axios";
import { getDate } from "helpers/date";
import { TimePicker } from "Common/Components/TimePIcker";
import AsyncPaginatedSelect from "Common/Components/Select/AsyncPaginatedSelect";
import { ReceiptItem } from "./components/ReceiptItem";
import { createSupplier } from "apis/supplier";

const CreateReceiptImport = (props: any) => {
  const [rows, setRows] = useState<any[]>([]);

  const [productListModal, setProductListModal] = useState(false);
  const productListModalToggle = () => setProductListModal(!productListModal);

  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.Supplier,
    (state) => ({
      supplierList: state.suppliers || [],
    })
  );

  const { supplierList } = useSelector(selectDataList);

  useEffect(() => {
    dispatch(onGetSupplierList({}));
  }, [dispatch]);

  const totalAmount = useMemo(() => {
    return rows.reduce((total, row) => {
      return total + row.totalPrice;
    }, 0);
  }, [rows]);

  const quantity = useMemo(() => {
    return rows.reduce((total, row) => {
      return total + row.quantity;
    }, 0);
  }, [rows]);

  const handleSubmitForm = async (values: any) => {
    if (!rows.length) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    }

    const items = rows.map((row) => ({
      productId: row.id,
      productCode: row.productCode,
      productName: row.name,
      quantity: row.quantity,
      inventory: row.inventory,
      costPrice: row.totalPrice,
      discount: row.discount,
    }));

    const payload = {
      note: values.note,
      status: values.status,
      importDate: getDate(values.importDate).format(),
      paymentDate: getDate(values.paymentDate).format(),
      quantity,
      supplier: values.supplier?.id,
      warehouse: values.warehouse,
      totalAmount,
      totalProduct: rows.length,
      items,
    };

    try {
      const response: IHttpResponse = await request.post(
        `/receipt-imports`,
        payload
      );

      if (response.statusCode !== 201) {
        toast.warn(response.message);
        return;
      }

      toast.success("Tạo phiếu nhập thành công");

      setTimeout(() => {
        props.router.navigate("/receipt-import/list");
      }, 700);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const validation: any = useFormik({
    enableReinitialize: false,

    initialValues: {
      importDate: "",
      paymentDate: "",
      supplier: null,
      warehouse: "",
      note: "",
    },
    validationSchema: Yup.object({
      importDate: Yup.string().required("Vui lòng chọn ngày nhập hàng"),
      paymentDate: Yup.string().required("Vui lòng chọn ngày thanh toán"),
      supplier: Yup.object({ id: Yup.string(), name: Yup.string() }).required("Vui lòng chọn nhà cung cấp"),
      warehouse: Yup.string().required("Vui lòng chọn cửa hàng"),
    }),
    onSubmit: handleSubmitForm,
  });

  const handleCreateSupplier = async (name: string) => {
    const result = await createSupplier({ name });
    return {
      value: result.id,
      label: name,
    };
  };

  const handleLoadSupplier = async (inputValue: string, page: number) => {
    try {
      const response: IHttpResponse = await request.get(
        `/suppliers?keyword=${inputValue}&page=${page}&limit=10`
      );

      if (
        (response.statusCode && response.statusCode !== 200) ||
        !response.success
      ) {
        throw new Error(response.message);
      }

      const { data, metadata } = response;

      return {
        results: data?.map((item: any) => ({
          value: item.id,
          label: item.name,
        })),
        hasMore: metadata?.hasNext,
        page: metadata?.currentPage,
      };
    } catch (error) {
      toast.error((error as Error).message);
      return {
        results: [],
        hasMore: false,
        page: 1,
      };
    }
  };

  return (
    <React.Fragment>
      <ProductListReceiptModal
        show={productListModal}
        isCreateNew={true}
        onCancel={productListModalToggle}
        onDone={(selectedProducts) => {
          if (!selectedProducts.length) return;

          setRows((prev) => {
            const newProducts = selectedProducts.map((item: any) => {
              const row = prev.find((row) => row.id === item.id);
              if (row) return row;

              return {
                id: item.id,
                productCode: item.productCode,
                code: item.code,
                name: item.name,
                quantity: 1,
                price: item.price,
                inventory: item.inventory,
                totalPrice: item.price,
                discount: 0,
              };
            });

            return [...newProducts];
          });
        }}
      />
      <ToastContainer closeButton={false} limit={1} />
      <BreadCrumb title="Tạo mới phiếu nhập" pageTitle="Products" />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
        <div className="xl:col-span-9">
          <div className="card">
            <div className="card-body">
              <form
                action="#!"
                onSubmit={(e: any) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-12">
                  <div className="xl:col-span-4">
                    <label
                      htmlFor="productCodeInput"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Mã phiếu
                    </label>
                    <input
                      type="text"
                      id="productCodeInput"
                      className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Mã phiếu"
                      value={`NH${dayjs().format("YYMMDDHHmm")}`}
                      disabled
                    />
                  </div>

                  <div className="xl:col-span-4">
                    <label
                      htmlFor="warehouseLocationSelect"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Cửa hàng
                    </label>
                    <select
                      className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      data-choices
                      data-choices-search-false
                      name="warehouse"
                      id="warehouseLocationSelect"
                      onChange={validation.handleChange}
                      value={validation.values.warehouse || ""}
                    >
                      <option value="">Chọn kho</option>
                      <option value="KS">Kho KS</option>
                      <option value="KH">Kho KH</option>
                    </select>
                    {validation.touched.warehouse &&
                    validation.errors.warehouse ? (
                      <p className="text-red-400">
                        {validation.errors.warehouse}
                      </p>
                    ) : null}
                  </div>

                  {/* Ghi chú */}
                  <div className="lg:col-span-2 xl:col-span-4 row-span-3">
                    <div>
                      <label
                        htmlFor="noteInput"
                        className="inline-block mb-2 text-base font-medium"
                      >
                        Ghi chú
                      </label>
                      <textarea
                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                        id="noteInput"
                        name="note"
                        placeholder="Nhập ghi chú"
                        rows={4}
                        onChange={validation.handleChange}
                        value={validation.values.note || ""}
                      ></textarea>
                    </div>
                  </div>

                  {/* Ngày thanh toán */}
                  <div className="xl:col-span-4">
                    <label
                      htmlFor="paymentDate"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Ngày thanh toán
                    </label>
                    <TimePicker
                      value={validation.values.paymentDate}
                      onChange={([date]) => {
                        validation.setFieldValue("paymentDate", date);
                      }}
                      props={{
                        placeholder: "Chọn ngày thanh toán",
                      }}
                    />
                    {validation.touched.paymentDate &&
                    validation.errors.paymentDate ? (
                      <p className="text-red-400">
                        {validation.errors.paymentDate}
                      </p>
                    ) : null}
                  </div>

                  {/* Ngày nhập hàng */}
                  <div className="xl:col-span-4">
                    <label
                      htmlFor="importDate"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Ngày nhập hàng
                    </label>
                    <TimePicker
                      value={validation.values.importDate}
                      onChange={([date]) => {
                        validation.setFieldValue("importDate", date);
                      }}
                      props={{
                        placeholder: "Chọn ngày nhập hàng",
                      }}
                    />
                    {validation.touched.importDate &&
                    validation.errors.importDate ? (
                      <p className="text-red-400">
                        {validation.errors.importDate}
                      </p>
                    ) : null}
                  </div>

                  <div className="xl:col-span-4">
                    <label
                      htmlFor="supplierSelect"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Nhà cung cấp
                    </label>
                    <AsyncPaginatedSelect
                      loadOptions={handleLoadSupplier}
                      defaultOptions={supplierList.map((supplier: Record<string, string>) => ({
                        label: supplier.name,
                        value: supplier.id,
                      }))}
                      placeholder="Chọn nhà cung cấp"
                      debounceTimeout={500}
                      noOptionsMessage={() => "Không thấy nhà cung cấp"}
                      createOption={handleCreateSupplier}
                      onChange={(option) => {
                        if (option) {
                            validation.setFieldValue("supplier", {
                              id: option.value,
                              name: option.label,
                            });
                        }
                      }}
                      value={
                        validation.values.supplier
                          ? {
                              label: validation.values?.supplier?.name,
                              value: validation.values?.supplier?.id,
                            }
                          : null
                      }
                    />
                    {validation.touched.supplier &&
                    validation.errors.supplier ? (
                      <p className="text-red-400">
                        {validation.errors.supplier}
                      </p>
                    ) : null}
                  </div>

                  {/* <div className="xl:col-span-4"> */}
                  {/*   <label */}
                  {/*     htmlFor="productStatusSelect" */}
                  {/*     className="inline-block mb-2 text-base font-medium" */}
                  {/*   > */}
                  {/*     Trạng thái */}
                  {/*   </label> */}
                  {/*   <select */}
                  {/*     className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" */}
                  {/*     data-choices */}
                  {/*     data-choices-search-false */}
                  {/*     name="status" */}
                  {/*     id="productStatusSelect" */}
                  {/*     onChange={validation.handleChange} */}
                  {/*     value={validation.values.status || ""} */}
                  {/*   > */}
                  {/*     <option value="draft">Nháp</option> */}
                  {/*     <option value="active">Đang xử lý</option> */}
                  {/*     <option value="inactive">Hoàn thành</option> */}
                  {/*     <option value="inactive">Hủy phiếu</option> */}
                  {/*     <option value="inactive">Nhận thiếu hàng</option> */}
                  {/*     <option value="inactive">Nhận dư hàng</option> */}
                  {/*   </select> */}
                  {/*   {validation.touched.status && validation.errors.status ? ( */}
                  {/*     <p className="text-red-400">{validation.errors.status}</p> */}
                  {/*   ) : null} */}
                  {/* </div> */}

                  <div className="lg:col-span-2 xl:col-span-12">
                    <div className="flex justify-start">
                      <button
                        type="button"
                        className="flex items-center relative mr-2 bg-white border-dashed text-custom-500 btn border-custom-500 hover:text-custom-500 hover:bg-custom-50 hover:border-custom-600 focus:text-custom-600 focus:bg-custom-50 focus:border-custom-600 active:text-custom-600 active:bg-custom-50 active:border-custom-600 dark:bg-zink-700 dark:ring-custom-400/20 dark:hover:bg-custom-800/20 dark:focus:bg-custom-800/20 dark:active:bg-custom-800/20"
                        onClick={productListModalToggle}
                      >
                        <Plus className="size-4" /> Thêm hàng hóa
                      </button>
                    </div>
                    <div className="mt-6 overflow-x-auto">
                      <table className="w-full whitespace-nowrap">
                        <thead className="ltr:text-left rtl:text-right">
                          <tr>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                              STT
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                              Mã hàng
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                              Tên
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                              Số lượng
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                              Chiết khấu (%)
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                              Giá nhập
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, index) => (
                            <ReceiptItem
                              key={row.id}
                              index={index}
                              item={row}
                              onRemove={(id: string) => {
                                setRows((prev) => {
                                  return prev.filter((r) => r.id !== id);
                                });
                              }}
                              onUpdate={(item) => {
                                setRows((prev) => {
                                  return prev.map((r) =>
                                    r.id === item.id ? { ...r, ...item } : r
                                  );
                                });
                              }}
                            />
                            // <tr key={row.id}>
                            //   <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                            //     {index + 1}
                            //   </td>
                            //   <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                            //     {row.code}
                            //   </td>
                            //   <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                            //     <h6 className="mb-1 text-wrap">{row.name}</h6>
                            //   </td>
                            //   <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                            //     <Counter
                            //       name="quantity"
                            //       initialValue={row.quantity}
                            //       onCountChange={(value) => {
                            //         setRows((prev) => {
                            //           return prev.map((r) =>
                            //             r.id === row.id
                            //               ? { ...r, quantity: value }
                            //               : r
                            //           );
                            //         });
                            //       }}
                            //     />
                            //   </td>
                            //   <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                            //     {/* {formatMoney(row.price)} */}
                            //     <input
                            //       type="text"
                            //       id="priceInput"
                            //       className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            //       placeholder="Giá nhập"
                            //     />
                            //   </td>
                            //   <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                            //     <button
                            //       type="button"
                            //       className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 dark:bg-zink-600 dark:text-zink-200 text-slate-500 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20"
                            //       onClick={() => {
                            //         setRows((prev) => {
                            //           return prev.filter(
                            //             (r) => r.id !== row.id
                            //           );
                            //         });
                            //       }}
                            //     >
                            //       <Trash2 />
                            //     </button>
                            //   </td>
                            // </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-end gap-2 mt-8">
                  <Link
                    to={"/receipt-import/list"}
                    className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                  >
                    Hủy bỏ
                  </Link>
                  <button
                    type="submit"
                    className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                    onClick={(e) =>
                      validation.setFieldValue("status", "processing")
                    }
                  >
                    Tạo phiếu
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-gray-500 border-gray-500 btn hover:text-white hover:bg-gray-600 hover:border-gray-600 focus:text-white focus:bg-gray-600 focus:border-gray-600 focus:ring focus:ring-gray-100 active:text-white active:bg-gray-600 active:border-gray-600 active:ring active:ring-gray-100 dark:ring-gray-400/10"
                    onClick={(e) => validation.setFieldValue("status", "draft")}
                  >
                    Tạo nháp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="xl:col-span-3">
          <div className="card sticky top-[calc(theme('spacing.header')_*_1.3)]">
            <div className="card-body">
              <h6 className="mb-4 text-15">Thông tin chung</h6>

              <div className="px-5 py-8 flex justify-center rounded-md bg-sky-50 dark:bg-zink-600">
                <Barcode
                  value={`NH${dayjs().format("YYMMDDHHmm")}`}
                  format="CODE128"
                  width={2}
                  height={100}
                  displayValue={true}
                />
              </div>

              <div className="mt-3">
                <ul className="flex flex-col gap-5">
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 text-red-500 bg-red-100 rounded-md dark:bg-red-500/20 shrink-0">
                      <Mail className="size-4"></Mail>
                    </div>
                    <h6 className="grow">Tổng số lượng</h6>
                    <p className="text-slate-500 dark:text-zink-200">
                      {quantity}
                    </p>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-md text-sky-500 bg-sky-100 dark:bg-sky-500/20 shrink-0">
                      <PackageOpen className="size-4"></PackageOpen>
                    </div>
                    <h6 className="grow">Tổng số mặt hàng</h6>
                    <p className="text-slate-500 dark:text-zink-200">
                      {rows.length}
                    </p>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 text-orange-500 bg-orange-100 rounded-md dark:bg-orange-500/20 shrink-0">
                      <UserX2 className="size-4"></UserX2>
                    </div>
                    <h6 className="grow">Tổng tiền hàng</h6>
                    <p className="text-slate-500 dark:text-zink-200">
                      {formatMoneyWithVND(totalAmount)}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(CreateReceiptImport);
