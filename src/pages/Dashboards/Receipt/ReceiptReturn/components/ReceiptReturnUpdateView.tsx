import ReceiptReturnProductPicker from "./ReceiptReturnProductPicker";
import React from "react";
import BreadCrumb from "Common/BreadCrumb";

// Formik

// react-redux

// Icons
import { ChevronLeft, Plus, Trash2 } from "lucide-react";

import { Counter } from "Common/Components/Counter";
import { formatMoney } from "helpers/utils";

import { ToastContainer } from "react-toastify";

import { Link } from "react-router-dom";
import { TimePicker } from "Common/Components/TimePIcker";

import AsyncPaginatedSelect from "Common/Components/Select/AsyncPaginatedSelect";

import type useReceiptReturnUpdate from "../hooks/useReceiptReturnUpdate";
import ReceiptReturnTotals from "./ReceiptReturnTotals";
const receiptReturnStatus = [
  { label: "Nháp", value: "draft" },
  { label: "Đang xử lý", value: "processing" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Hủy phiếu", value: "cancelled" },
];

const receiptReturnType = [
  { label: "Khách hàng", value: "customer" },
  { label: "Nhà cung cấp", value: "supplier" },
];

const warehouse = [
  { label: "Kho KS1", value: "Kho KS1" },
  { label: "Kho KS2", value: "Kho KS2" },
  { label: "Kho KH", value: "Kho KH" },
];


export default function ReceiptReturnUpdateView({
  supplierList,
  rows,
  setRows,
  productListModal,
  productListModalToggle,
  receiptId,
  receiptInfo,
  validation,
  reasons,
  selectedReason,
  customReason,
  setCustomReason,
  handleReasonChange,
  handleLoadSupplier,
  handleCreateSupplier,
  handleBackToList,
  totalAmount,
  quantity,
}: ReturnType<typeof useReceiptReturnUpdate>) {
  return (
    <React.Fragment>
      <ReceiptReturnProductPicker
        productListModal={productListModal}
        rows={rows}
        productListModalToggle={productListModalToggle}
        setRows={setRows}
      />
      <ToastContainer closeButton={false} limit={1} />
      <BreadCrumb title="Cập nhật phiếu trả" pageTitle="Receipt Return" />
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
                      value={receiptInfo.receiptNumber}
                      disabled
                    />
                  </div>

                  {/* loại phiếu trả */}
                  <div className="xl:col-span-4">
                    <label
                      htmlFor="typeSelect"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Loại phiếu trả
                    </label>

                    <select
                      className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      data-choices
                      data-choices-search-false
                      name="type"
                      id="typeSelect"
                      onChange={(e) => {
                        validation.setFieldValue("name", "");
                        validation.handleChange(e);
                      }}
                      value={validation.values.type || ""}
                    >
                      {receiptReturnType.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {validation.touched.type && validation.errors.type
                      ? <p className="text-red-400">{validation.errors.type}</p>
                      : null}
                  </div>

                  {/* Ghi chú */}
                  <div className="lg:col-span-2 xl:col-span-4 row-span-2">
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
                      >
                      </textarea>
                    </div>
                  </div>

                  {validation.values.type === "supplier"
                    ? (
                      <div className="xl:col-span-4">
                        <label
                          htmlFor="supplierSelect"
                          className="inline-block mb-2 text-base font-medium"
                        >
                          Nhà cung cấp
                        </label>
                        <AsyncPaginatedSelect
                          loadOptions={handleLoadSupplier}
                          defaultOptions={supplierList.map(
                            (supplier: Record<string, string>) => ({
                              label: supplier.name,
                              value: supplier.id,
                            }),
                          )}
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
                          value={validation.values.supplier
                            ? {
                              label: validation.values?.supplier?.name,
                              value: validation.values?.supplier?.id,
                            }
                            : null}
                        />
                        {validation.touched.supplier &&
                            validation.errors.supplier
                          ? (
                            <p className="text-red-400">
                              {validation.errors.supplier}
                            </p>
                          )
                          : null}
                      </div>
                    )
                    : (
                      <div className="xl:col-span-4">
                        <label
                          htmlFor="customerNameInput"
                          className="inline-block mb-2 text-base font-medium"
                        >
                          Tên khách hàng
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="customerNameInput"
                          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                          placeholder="Nhập tên"
                          onChange={validation.handleChange}
                          value={validation.values.name || ""}
                        />
                        {validation.touched.name && validation.errors.name
                          ? <p className="text-red-400">{validation.errors.name}</p>
                          : null}
                      </div>
                    )}

                  {/* Trạng thái */}
                  <div className="xl:col-span-4">
                    <label
                      htmlFor="statusSelect"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Trạng thái
                    </label>
                    <select
                      className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      data-choices
                      data-choices-search-false
                      name="status"
                      id="statusSelect"
                      onChange={validation.handleChange}
                      value={validation.values.status || ""}
                      disabled={validation.values.status === "completed"}
                    >
                      {receiptReturnStatus.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    {validation.touched.status && validation.errors.status
                      ? <p className="text-red-400">{validation.errors.status}</p>
                      : null}
                  </div>

                  {/* Ngày trả hàng */}
                  <div className="xl:col-span-4">
                    <label
                      htmlFor="returnDate"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Ngày trả hàng
                    </label>
                    <TimePicker
                      value={validation.values.returnDate}
                      onChange={([date]) => {
                        validation.setFieldValue("returnDate", date);
                      }}
                      props={{
                        placeholder: "Chọn ngày trả hàng",
                      }}
                    />
                    {validation.touched.returnDate &&
                        validation.errors.returnDate
                      ? (
                        <p className="text-red-400">
                          {validation.errors.returnDate}
                        </p>
                      )
                      : null}
                  </div>

                  {/* Cửa hàng */}
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
                      {warehouse.map((location) => (
                        <option key={location.value} value={location.value}>
                          {location.label}
                        </option>
                      ))}
                    </select>
                    {validation.touched.warehouse &&
                        validation.errors.warehouse
                      ? (
                        <p className="text-red-400">
                          {validation.errors.warehouse}
                        </p>
                      )
                      : null}
                  </div>

                  {/* Lý do */}
                  <div className="xl:col-span-4 flex flex-col">
                    <label className="inline-block mb-2 text-base font-medium">
                      Lý do trả
                    </label>
                    {reasons.map((reason, index) => (
                      <div key={index} className="flex items-center mt-1">
                        <input
                          type="radio"
                          id={`reason-${index}`}
                          name="reason"
                          value={reason}
                          checked={selectedReason === reason}
                          onChange={() => {
                            handleReasonChange(reason);
                          }}
                          className="size-4 border rounded-full appearance-none cursor-pointer bg-slate-100 border-slate-200 dark:bg-zink-600 dark:border-zink-500 checked:bg-custom-500 checked:border-custom-500 dark:checked:bg-custom-500 dark:checked:border-custom-500"
                        />
                        <label
                          htmlFor={`reason-${index}`}
                          className="ml-3 text-gray-700 text-sm"
                        >
                          {reason}
                        </label>
                      </div>
                    ))}

                    {selectedReason === "Lý do khác" && (
                      <div className="mt-2">
                        <label
                          htmlFor="customReason"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nhập lý do của bạn
                        </label>
                        <input
                          type="text"
                          id="customReason"
                          value={customReason}
                          onChange={(e) => {
                            const reason = e.target.value;
                            setCustomReason(reason);
                          }}
                          className="mt-1 px-3 py-2 form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                          placeholder="Nhập lý do hủy đơn"
                        />
                      </div>
                    )}
                    {validation.touched.reason && validation.errors.reason
                      ? <p className="text-red-400">{validation.errors.reason}</p>
                      : null}
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
                              Số lượng
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                              Giá nhập
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold text-slate-500 dark:text-zink-200 border-b border-slate-200 dark:border-zink-500">
                            </th>
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
                                <Counter
                                  name="quantity"
                                  initialValue={row.quantity}
                                  onCountChange={(value) => {
                                    setRows((prev) => {
                                      return prev.map((r) => r.id === row.id ? { ...r, quantity: value } : r);
                                    });
                                  }}
                                />
                              </td>
                              <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                                {formatMoney(row.price)}
                              </td>
                              <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                                <button
                                  type="button"
                                  className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 dark:bg-zink-600 dark:text-zink-200 text-slate-500 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20"
                                  onClick={() => {
                                    setRows((prev) => {
                                      return prev.filter(
                                        (r) => r.id !== row.id,
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
                    to={"/receipt-return/list"}
                    className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                  >
                    Hủy bỏ
                  </Link>
                  <button
                    type="submit"
                    className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ReceiptReturnTotals rows={rows} totalAmount={totalAmount} quantity={quantity} receiptInfo={receiptInfo} />
      </div>
    </React.Fragment>
  );
}
