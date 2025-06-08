import React from "react";
import { FormikProps } from "formik";
import { CUSTOMER_STATUS } from "Common/constants/customer-constant";

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

interface CustomerAdditionalInfoProps {
  validation: FormikProps<CustomerFormData>;
  isEdit: boolean;
}

const CustomerAdditionalInfo: React.FC<CustomerAdditionalInfoProps> = ({
  validation,
}) => {
  return (
    <div className="space-y-4">
      {/* Ghi chú */}
      <div>
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

      {/* Status */}
      <div>
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
          <option value={CUSTOMER_STATUS.ACTIVE}>Hoạt động</option>
          <option value={CUSTOMER_STATUS.INACTIVE}>Không hoạt động</option>
        </select>
      </div>
    </div>
  );
};

export default CustomerAdditionalInfo;
