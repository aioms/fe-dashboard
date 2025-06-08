import React from 'react';
import { FormikProps } from 'formik';
import { CUSTOMER_GROUP } from 'Common/constants/customer-constant';

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

interface CustomerBasicInfoProps {
  validation: FormikProps<CustomerFormData>;
}

const CustomerBasicInfo: React.FC<CustomerBasicInfoProps> = ({ validation }) => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 mb-4">
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
          <option value={CUSTOMER_GROUP.INDIVIDUAL}>Cá nhân</option>
          <option value={CUSTOMER_GROUP.BUSINESS}>Công ty</option>
        </select>
      </div>

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
    </div>
  );
};

export default CustomerBasicInfo;