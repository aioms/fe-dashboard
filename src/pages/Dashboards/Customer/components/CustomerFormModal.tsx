import React from 'react';
import Modal from "Common/Components/Modal";
import { FormikProps } from "formik";
import CustomerBasicInfo from "./CustomerBasicInfo";
import CustomerContactInfo from "./CustomerContactInfo";
import CustomerAdditionalInfo from "./CustomerAdditionalInfo";

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

interface CustomerFormModalProps {
  show: boolean;
  onHide: () => void;
  isEdit: boolean;
  validation: FormikProps<CustomerFormData>;
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  show,
  onHide,
  isEdit,
  validation,
}) => {
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
          {!!isEdit ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
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

          <CustomerBasicInfo validation={validation} />
          <CustomerContactInfo validation={validation} />
          <CustomerAdditionalInfo validation={validation} isEdit={isEdit} />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="reset"
              className="text-red-500 transition-all duration-200 ease-linear bg-white border-white btn hover:text-red-600 focus:text-red-600 active:text-red-600 dark:bg-zink-500 dark:border-zink-500"
              onClick={onHide}
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

export default CustomerFormModal;
