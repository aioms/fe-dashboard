import React from "react";
import { FormikProps } from "formik";

interface CustomerFormData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  taxId?: string;
  company?: string;
  address?: string;
  note?: string;
  type: string;
  status: string;
}

interface CustomerContactInfoProps {
  validation: FormikProps<CustomerFormData>;
}

const CustomerContactInfo: React.FC<CustomerContactInfoProps> = ({
  validation,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 mb-4">
      {/* Số điện thoại */}
      <div className="xl:col-span-6">
        <label
          htmlFor="phoneInput"
          className="inline-block mb-2 text-base font-medium"
        >
          Số điện thoại <span className="text-red-500">*</span>
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
          htmlFor="taxIdInput"
          className="inline-block mb-2 text-base font-medium"
        >
          Mã số thuế
        </label>
        <input
          type="text"
          id="taxIdInput"
          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          placeholder="Nhập mã số thuế"
          name="taxId"
          onChange={validation.handleChange}
          value={validation.values.taxId || ""}
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
    </div>
  );
};

export default CustomerContactInfo;
