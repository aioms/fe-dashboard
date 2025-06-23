import React from "react";
import Modal from "Common/Components/Modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { SUPPLIER_STATUS } from "Common/constants/supplier-constant";

interface AddEditSupplierModalProps {
  show: boolean;
  onHide: () => void;
  isEdit: boolean;
  eventData: any;
  onSubmit: (values: any) => void;
}

const AddEditSupplierModal: React.FC<AddEditSupplierModalProps> = ({
  show,
  onHide,
  isEdit,
  eventData,
  onSubmit,
}) => {
  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: (eventData && eventData.name) || "",
      email: (eventData && eventData.email) || "",
      phone: (eventData && eventData.phone) || "",
      company: (eventData && eventData.company) || "",
      taxCode: (eventData && eventData.taxCode) || "",
      address: (eventData && eventData.address) || "",
      note: (eventData && eventData.note) || "",
      status: (eventData && eventData.status) || SUPPLIER_STATUS.COLLABORATING,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập tên nhà cung cấp"),
    }),

    onSubmit: (values) => {
      onSubmit(values);
      validation.resetForm();
    },
  });

  const handleCancel = () => {
    validation.resetForm();
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      id="defaultModal"
      modal-center="true"
      className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
      dialogClassName="w-screen lg:w-[55rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full"
    >
      <Modal.Header
        className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
        closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
      >
        <Modal.Title className="text-16">
          {!!isEdit ? "Cập nhật" : "Thêm mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
        <form
          action="#!"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-12 mb-3">
            {/* Họ và tên */}
            <div className="xl:col-span-6">
              <label
                htmlFor="nameInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Tên nhà cung cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nameInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập họ và tên"
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
              {validation.touched.taxCode && validation.errors.taxCode ? (
                <p className="text-red-400">{validation.errors.taxCode}</p>
              ) : null}
            </div>
          </div>

          {/* Company */}
          <div className="mb-3">
            <label
              htmlFor="companyInput"
              className="inline-block mb-2 text-base font-medium"
            >
              Công ty phụ trách
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
            {validation.touched.company && validation.errors.company ? (
              <p className="text-red-400">{validation.errors.company}</p>
            ) : null}
          </div>

          {/* Address */}
          <div className="mb-3">
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
            {validation.touched.address && validation.errors.address ? (
              <p className="text-red-400">{validation.errors.address}</p>
            ) : null}
          </div>

          {/* Ghi chú */}
          <div className="mb-3">
            <label
              htmlFor="noteInput"
              className="inline-block mb-2 text-base font-medium"
            >
              Ghi chú
            </label>
            <input
              type="text"
              id="noteInput"
              className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
              placeholder="Nhập ghi chú"
              name="note"
              onChange={validation.handleChange}
              value={validation.values.note || ""}
            />
            {validation.touched.note && validation.errors.note ? (
              <p className="text-red-400">{validation.errors.note}</p>
            ) : null}
          </div>

          {/* Status */}
          <div className="mb-3">
            <label
              htmlFor="statusSelect"
              className="inline-block mb-2 text-base font-medium"
            >
              Trạng thái
            </label>
            <select
              className="form-input border-slate-300 focus:outline-none focus:border-custom-500"
              data-choices
              data-choices-search-false
              id="statusSelect"
              name="status"
              onChange={validation.handleChange}
              value={validation.values.status || ""}
            >
              <option value={SUPPLIER_STATUS.COLLABORATING}>
                Đang hợp tác
              </option>
              <option value={SUPPLIER_STATUS.PAUSED}>Tạm dừng</option>
              {isEdit && (
                <option value={SUPPLIER_STATUS.STOPPED_COLLABORATING}>
                  Ngừng hợp tác
                </option>
              )}
            </select>
            {validation.touched.status && validation.errors.status ? (
              <p className="text-red-400">{validation.errors.status}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              data-modal-close="addDocuments"
              className="text-red-500 transition-all duration-200 ease-linear bg-white border-white btn hover:text-red-600 focus:text-red-600 active:text-red-600 dark:bg-zink-500 dark:border-zink-500"
              onClick={handleCancel}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="text-white transition-all duration-200 ease-linear btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
            >
              {!!isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditSupplierModal;
