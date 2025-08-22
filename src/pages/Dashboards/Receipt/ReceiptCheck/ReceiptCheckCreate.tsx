import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Barcode from "react-barcode";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { toast } from "react-toastify";

// Slices
import { getUserList as onGetUserList } from "slices/thunk";

// Icons
import { PackageOpen, UserX2, Plus, Trash2, ChevronLeft } from "lucide-react";

// Helpers
import { IHttpResponse } from "types";
import { formatMoney, formatMoneyWithVND } from "helpers/utils";
import { request } from "helpers/axios";
import { getDate } from "helpers/date";

// Components
import withRouter from "Common/withRouter";
import { TimePicker } from "Common/Components/TimePIcker";
import AsyncPaginatedSelect from "Common/Components/Select/AsyncPaginatedSelect";
import ProductListReceiptModal from "../components/ProductListReceiptModal";

const CreateReceiptCheck = (props: any) => {
  const [rows, setRows] = useState<any[]>([]);

  const [productListModal, setProductListModal] = useState(false);

  const dispatch = useDispatch<any>();

  const productListModalToggle = () => setProductListModal(!productListModal);

  const userSelector = createSelector(
    (state: any) => state.Users,
    (user) => ({
      userList: user.userList || [],
      pagination: user.pagination || {},
    })
  );

  const { userList } = useSelector(userSelector);

  useEffect(() => {
    dispatch(onGetUserList({}));
  }, [dispatch]);

  const totalAmount = useMemo(() => {
    return rows.reduce((total, row) => {
      return total + row.inventory * row.price;
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
      quantity: 1,
      inventory: row.inventory,
      costPrice: row.price,
    }));

    const payload = {
      date: getDate(values.date).format(),
      note: values.note,
      periodic: values.periodic,
      checker: values.checker,
      items,
    };

    try {
      const response: IHttpResponse = await request.post(
        `/receipt-check`,
        payload
      );

      if (response.statusCode !== 201) {
        toast.warn(response.message);
        return "";
      }

      toast.success("Tạo phiếu thành công");

      setTimeout(() => {
        props.router.navigate("/receipt-check/list");
      }, 700);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const validation: any = useFormik({
    enableReinitialize: false,

    initialValues: {
      date: "",
      periodic: "",
      checker: null,
    },
    validationSchema: Yup.object({
      date: Yup.string().required("Vui lòng chọn ngày kiểm hàng"),
      periodic: Yup.string().required("Vui lòng chọn đợt kiểm"),
      checker: Yup.string().required("Vui lòng chọn người kiểm"),
    }),
    onSubmit: handleSubmitForm,
  });

  const handleLoadUsers = async (inputValue: string, page: number) => {
    try {
      const response: IHttpResponse = await request.get(
        `/users?keyword=${inputValue}&page=${page}&limit=10`
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
          label: item.fullname,
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

  const handleBackToList = () => {
    props.router.navigate("/receipt-check/list");
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
                suppliers: item.suppliers,
              };
            });

            return [...newProducts];
          });
        }}
      />
      {/* <ToastContainer closeButton={false} limit={1} /> */}
      <BreadCrumb title="Tạo mới phiếu kiểm" pageTitle="Products" />

      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={handleBackToList}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-700 dark:bg-zink-700 dark:border-zink-500 dark:text-zink-200 dark:hover:bg-zink-600 dark:hover:text-zink-100 transition-all duration-200"
        >
          <ChevronLeft className="size-4 mr-1" />
          Quay lại danh sách
        </button>
      </div>

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
                      value={`KIEM${dayjs().format("YYMMDDHHmm")}`}
                      disabled
                    />
                  </div>

                  <div className="xl:col-span-4">
                    <label
                      htmlFor="periodicSelect"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Đợt kiểm
                    </label>
                    <select
                      className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      data-choices
                      data-choices-search-false
                      name="periodic"
                      id="periodicSelect"
                      onChange={validation.handleChange}
                      value={validation.values.periodic || ""}
                    >
                      <option value="">Chọn</option>
                      <option value={`Quý 1 - ${new Date().getFullYear()}`}>
                        Quý 1 - {new Date().getFullYear()}
                      </option>
                      <option value={`Quý 2 - ${new Date().getFullYear()}`}>
                        Quý 2 - {new Date().getFullYear()}
                      </option>
                      <option value={`Quý 3 - ${new Date().getFullYear()}`}>
                        Quý 3 - {new Date().getFullYear()}
                      </option>
                      <option value={`Quý 4 - ${new Date().getFullYear()}`}>
                        Quý 4 - {new Date().getFullYear()}
                      </option>
                      <option value="Đột xuất">Đột xuất</option>
                    </select>
                    {validation.touched.periodic &&
                    validation.errors.periodic ? (
                      <p className="text-red-400">
                        {validation.errors.periodic}
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

                  {/* Ngày kiểm */}
                  <div className="xl:col-span-4">
                    <label
                      htmlFor="date"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Ngày kiểm
                    </label>
                    <TimePicker
                      value={validation.values.date}
                      onChange={([date]) => {
                        validation.setFieldValue("date", date);
                      }}
                      props={{
                        placeholder: "Chọn ngày kiểm",
                      }}
                    />
                    {validation.touched.date && validation.errors.date ? (
                      <p className="text-red-400">{validation.errors.date}</p>
                    ) : null}
                  </div>

                  {/* người kiểm hàng */}
                  <div className="xl:col-span-4">
                    <label
                      htmlFor="checker"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Người kiểm
                    </label>
                    <AsyncPaginatedSelect
                      loadOptions={handleLoadUsers}
                      defaultOptions={userList.map(
                        (user: Record<string, string>) => ({
                          label: user.fullname,
                          value: user.id,
                        })
                      )}
                      placeholder="Chọn người kiểm"
                      debounceTimeout={500}
                      noOptionsMessage={() => "Không tìm thấy user"}
                      onChange={(option) => {
                        if (option) {
                          validation.setFieldValue("checker", option.value);
                        }
                      }}
                    />
                    {validation.touched.checker && validation.errors.checker ? (
                      <p className="text-red-400">
                        {validation.errors.checker}
                      </p>
                    ) : null}
                  </div>

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
                              Nhà cung cấp
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                              Tồn kho
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                              Giá trị tồn
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, index) => (
                            <tr key={row.id}>
                              <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                                {index + 1}
                              </td>
                              <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                                {row.code}
                              </td>
                              <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                                <h6 className="mb-1 text-wrap">{row.name}</h6>
                              </td>
                              <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                                <h6 className="mb-1 text-wrap">{row.suppliers?.map((supplier: any) => supplier.name).join(", ")}</h6>
                              </td>
                              <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                                {row.inventory}
                              </td>
                              <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                                {formatMoney(row.price * row.inventory)}
                              </td>
                              <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                                <button
                                  type="button"
                                  className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 dark:bg-zink-600 dark:text-zink-200 text-slate-500 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20"
                                  onClick={() => {
                                    setRows((prev) => {
                                      return prev.filter(
                                        (r) => r.id !== row.id
                                      );
                                    });
                                  }}
                                >
                                  <Trash2 />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-end gap-2 mt-8">
                  <Link
                    to={"/receipt-check/list"}
                    className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                  >
                    Hủy bỏ
                  </Link>
                  <button
                    type="submit"
                    className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                    onClick={() =>
                      validation.setFieldValue("status", "pending")
                    }
                  >
                    Tạo phiếu
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
                  value={`KIEM${dayjs().format("YYMMDDHHmm")}`}
                  format="CODE128"
                  width={2}
                  height={100}
                  displayValue={true}
                />
              </div>

              <div className="mt-3">
                <ul className="flex flex-col gap-5">
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

export default withRouter(CreateReceiptCheck);
