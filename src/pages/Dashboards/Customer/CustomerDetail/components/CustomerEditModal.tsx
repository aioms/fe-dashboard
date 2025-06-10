import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import {
  CUSTOMER_STATUS,
  CUSTOMER_GROUP,
} from "Common/constants/customer-constant";
import Modal from "Common/Components/Modal";
import type { ICustomer } from "../index.d";
import { updateCustomerThunk } from "slices/thunk";

interface CustomerEditModalProps {
  show: boolean;
  onHide: () => void;
  customer: ICustomer;
  onSuccess: () => void;
}

const CustomerEditModal: React.FC<CustomerEditModalProps> = ({
  show,
  onHide,
  customer,
  onSuccess,
}) => {
  const dispatch = useDispatch<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: customer?.id || "",
      name: customer?.name || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
      taxCode: customer?.taxCode || "",
      company: customer?.company || "",
      address: customer?.address || "",
      note: customer?.note || "",
      type:
        customer?.status === CUSTOMER_STATUS.ACTIVE
          ? CUSTOMER_GROUP.INDIVIDUAL.toString()
          : CUSTOMER_GROUP.BUSINESS.toString(),
      status: customer?.status?.toString() || CUSTOMER_STATUS.ACTIVE.toString(),
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập tên khách hàng"),
      phone: Yup.string()
        .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
        .nullable(),
      email: Yup.string().email("Email không hợp lệ").nullable(),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        // Chuyển đổi dispatch thành Promise và xử lý kết quả
        await dispatch(updateCustomerThunk(values))
          .unwrap()
          .then(() => {
            toast.success("Cập nhật thông tin khách hàng thành công");
            onSuccess();
            onHide();
          })
          .catch((error: any) => {
            console.error("Error updating customer:", error);
            toast.error(
              error?.message || "Cập nhật thông tin khách hàng thất bại"
            );
          });
      } catch (error) {
        console.error("Error updating customer:", error);
        toast.error("Cập nhật thông tin khách hàng thất bại");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validation.handleSubmit();
    return false;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      modal-center="true"
      className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
      dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600"
    >
      <Modal.Header
        className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
        closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
      >
        <Modal.Title className="text-16">
          Cập nhật thông tin khách hàng
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
        <form
          className="create-form"
          id="create-form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <input value={validation.values.id} name="id" type="hidden" />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 mb-4">
            {/* Tên khách hàng */}
            <div className="xl:col-span-12">
              <label
                htmlFor="nameInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Tên khách hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nameInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập tên khách hàng"
                name="name"
                onChange={validation.handleChange}
                value={validation.values.name || ""}
              />
              {validation.touched.name && validation.errors.name ? (
                <p className="text-red-400">{validation.errors.name}</p>
              ) : null}
            </div>

            {/* Số điện thoại */}
            <div className="xl:col-span-6">
              <label
                htmlFor="phoneInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                id="phoneInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập số điện thoại"
                name="phone"
                onChange={validation.handleChange}
                value={validation.values.phone || ""}
              />
              {validation.touched.phone && validation.errors.phone ? (
                <p className="text-red-400">{validation.errors.phone}</p>
              ) : null}
            </div>

            {/* Email */}
            <div className="xl:col-span-6">
              <label
                htmlFor="emailInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="emailInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập email"
                name="email"
                onChange={validation.handleChange}
                value={validation.values.email || ""}
              />
              {validation.touched.email && validation.errors.email ? (
                <p className="text-red-400">{validation.errors.email}</p>
              ) : null}
            </div>

            {/* MST */}
            <div className="xl:col-span-6">
              <label
                htmlFor="taxCodeInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Mã số thuế
              </label>
              <input
                type="text"
                id="taxCodeInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập mã số thuế"
                name="taxCode"
                onChange={validation.handleChange}
                value={validation.values.taxCode || ""}
              />
            </div>

            {/* Company */}
            <div className="xl:col-span-6">
              <label
                htmlFor="companyInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Công ty
              </label>
              <input
                type="text"
                id="companyInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập tên công ty"
                name="company"
                onChange={validation.handleChange}
                value={validation.values.company || ""}
              />
            </div>

            {/* Address */}
            <div className="xl:col-span-12">
              <label
                htmlFor="addressInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Địa chỉ
              </label>
              <input
                type="text"
                id="addressInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập địa chỉ"
                name="address"
                onChange={validation.handleChange}
                value={validation.values.address || ""}
              />
            </div>

            {/* Ghi chú */}
            <div className="xl:col-span-12">
              <label
                htmlFor="noteInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Ghi chú
              </label>
              <textarea
                id="noteInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập ghi chú"
                name="note"
                rows={3}
                onChange={validation.handleChange}
                value={validation.values.note || ""}
              />
            </div>

              {/* Trạng thái */}
              <div className="xl:col-span-6">
                <label
                  htmlFor="statusSelect"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Trạng thái
                </label>
                <select
                  className="form-input border-slate-300 focus:outline-none focus:border-custom-500"
                  id="statusSelect"
                  name="status"
                  onChange={validation.handleChange}
                  value={validation.values.status || ""}
                >
                  <option value={CUSTOMER_STATUS.ACTIVE.toString()}>
                    Hoạt động
                  </option>
                  <option value={CUSTOMER_STATUS.INACTIVE.toString()}>
                    Không hoạt động
                  </option>
                </select>
              </div>

              {/* Nhóm khách hàng */}
              <div className="xl:col-span-6">
                <label
                  htmlFor="typeSelect"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Nhóm khách hàng
                </label>
                <select
                  className="form-input border-slate-300 focus:outline-none focus:border-custom-500"
                  id="typeSelect"
                  name="type"
                  onChange={validation.handleChange}
                  value={validation.values.type || ""}
                >
                  <option value={CUSTOMER_GROUP.INDIVIDUAL.toString()}>
                    Cá nhân
                  </option>
                  <option value={CUSTOMER_GROUP.BUSINESS.toString()}>
                    Công ty
                  </option>
                </select>
              </div>
            </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="reset"
              className="text-red-500 transition-all duration-200 ease-linear bg-white border-white btn hover:text-red-600 focus:text-red-600 active:text-red-600 dark:bg-zink-500 dark:border-zink-500"
              onClick={onHide}
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="text-white transition-all duration-200 ease-linear btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CustomerEditModal;
