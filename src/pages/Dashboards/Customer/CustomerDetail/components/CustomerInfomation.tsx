import { useState } from "react";
import type { ICustomer } from "../index.d";
import { CustomerStatusBadge } from "../../components/CustomerStatus";
import CustomerEditModal from "./CustomerEditModal";
import { CUSTOMER_GROUP } from "Common/constants/customer-constant";

const CustomerInformation: React.FC<{
  customer: ICustomer | null;
  onCustomerUpdated?: () => void;
}> = ({ customer, onCustomerUpdated }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Đang tải thông tin khách hàng...</div>
      </div>
    );
  }

  const renderStatusBadge = () => {
    if (customer.status === null || customer.status === undefined) {
      return (
        <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-gray-100 border-transparent text-gray-500 dark:bg-gray-500/20 dark:text-gray-400 dark:border-transparent">
          --
        </span>
      );
    }
    return <CustomerStatusBadge status={customer.status} />;
  };

  const renderCustomerType = () => {
    if (customer.type === undefined) {
      return "--";
    }

    switch (Number(customer.type)) {
      case CUSTOMER_GROUP.INDIVIDUAL:
        return (
          <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-sky-100 border-transparent text-sky-500 dark:bg-sky-500/20 dark:text-sky-400 dark:border-transparent">
            Cá nhân
          </span>
        )
      case CUSTOMER_GROUP.BUSINESS:
        return (
          <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-purple-100 border-transparent text-purple-500 dark:bg-purple-500/20 dark:text-purple-400 dark:border-transparent">
            Công ty
          </span>
        )
      default:
        return "--";
    }
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    if (onCustomerUpdated) {
      onCustomerUpdated();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-zink-50">
          Thông tin khách hàng
        </h3>
        <button
          className="btn bg-custom-500 border-custom-500 text-white hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100"
          onClick={handleEditClick}
        >
          Chỉnh sửa
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Mã khách hàng
            </label>
            <div className="text-slate-800 dark:text-zink-50 font-medium">
              {customer.customerCode}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Họ và tên
            </label>
            <div className="text-slate-800 dark:text-zink-50 font-medium">
              {customer.name || "--"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Số điện thoại
            </label>
            <div className="text-slate-800 dark:text-zink-50">
              {customer.phone || "--"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Email
            </label>
            <div className="text-slate-800 dark:text-zink-50">
              {customer.email || "--"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Trạng thái
            </label>
            <div>{renderStatusBadge()}</div>
          </div>

        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Công ty/Cửa hàng
            </label>
            <div className="text-slate-800 dark:text-zink-50">
              {customer.company || "--"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Mã số thuế (MST)
            </label>
            <div className="text-slate-800 dark:text-zink-50">
              {customer.taxCode || "--"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Địa chỉ giao hàng
            </label>
            <div className="text-slate-800 dark:text-zink-50">
              {customer.address || "--"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Ghi chú nội bộ
            </label>
            <div className="text-slate-800 dark:text-zink-50">
              {customer.note || "--"}
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-zink-200 mb-1">
              Nhóm khách hàng
            </label>
            <div className="text-slate-800 dark:text-zink-50">
              {renderCustomerType()}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Edit Modal */}
      {customer && (
        <CustomerEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          customer={customer}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default CustomerInformation;
