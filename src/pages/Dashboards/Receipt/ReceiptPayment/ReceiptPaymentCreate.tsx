import React, { useState, useEffect } from "react";
import BreadCrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft, Save, Info } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Components
import { FileUpload, UploadedFile } from "Common/Components/FileUpload";
import { MoneyInput } from "Common/Components/MoneyInput";

// Types and actions
import {
  CreateReceiptPaymentRequestDto,
  ReceiptPaymentExpenseType,
  ReceiptPaymentStatus,
  PaymentMethod,
  Attachment
} from "types/receiptPayment";
import { createReceiptPayment, getUnpaidReceipts } from "slices/receipt-payment/thunk";
import { UnpaidReceipt } from "./mockData";

const expenseTypeOptions = [
  { value: ReceiptPaymentExpenseType.SUPPLIER_PAYMENT, label: "Chi tiền hàng NCC" },
  { value: ReceiptPaymentExpenseType.TRANSPORTATION, label: "Vận chuyển" },
  { value: ReceiptPaymentExpenseType.UTILITIES, label: "Tiện ích" },
  { value: ReceiptPaymentExpenseType.RENT, label: "Thuê mặt bằng" },
  { value: ReceiptPaymentExpenseType.LABOR, label: "Nhân công" },
  { value: ReceiptPaymentExpenseType.OTHER, label: "Khác" },
];

const paymentMethodOptions = [
  { value: PaymentMethod.CASH, label: "Tiền mặt" },
  { value: PaymentMethod.BANK_TRANSFER, label: "Chuyển khoản" },
];

const statusOptions = [
  { value: ReceiptPaymentStatus.DRAFT, label: "Nháp" },
  { value: ReceiptPaymentStatus.PAID, label: "Đã chi" },
  { value: ReceiptPaymentStatus.DEBT_PAYMENT, label: "Nợ chi" },
];

const ReceiptPaymentCreate: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateReceiptPaymentRequestDto>({
    paymentDate: new Date().toISOString().split('T')[0],
    expenseType: ReceiptPaymentExpenseType.SUPPLIER_PAYMENT,
    amount: 0,
    paymentMethod: PaymentMethod.CASH,
    status: ReceiptPaymentStatus.DRAFT,
    attachments: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<UnpaidReceipt | null>(null);
  const [unpaidReceipts, setUnpaidReceipts] = useState<UnpaidReceipt[]>([]);

  // Load unpaid receipts when expense type is supplier payment
  useEffect(() => {
    if (formData.expenseType === ReceiptPaymentExpenseType.SUPPLIER_PAYMENT) {
      // Load unpaid receipts from API
      dispatch(getUnpaidReceipts(undefined))
        .unwrap()
        .then((receipts: UnpaidReceipt[]) => {
          setUnpaidReceipts(receipts);
        })
        .catch((error: any) => {
          console.error('Error loading unpaid receipts:', error);
          setUnpaidReceipts([]);
        });
    } else {
      setUnpaidReceipts([]);
      setSelectedReceipt(null);
      setFormData(prev => ({
        ...prev,
        receiptImportId: undefined,
        supplierId: undefined,
        paymentObject: getPaymentObjectName(prev.expenseType),
      }));
    }
  }, [formData.expenseType, dispatch]);

  // Update form data when receipt is selected
  useEffect(() => {
    if (selectedReceipt) {
      setFormData(prev => ({
        ...prev,
        receiptImportId: selectedReceipt.id,
        supplierId: selectedReceipt.supplier.id,
        paymentObject: `${selectedReceipt.code} - ${selectedReceipt.supplier.name}`,
        amount: selectedReceipt.remainingAmount,
      }));
    }
  }, [selectedReceipt]);

  // Update attachments when files change
  useEffect(() => {
    const attachments: Attachment[] = uploadedFiles.map(file => ({
      id: file.id,
      name: file.name,
      path: file.url || '',
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    setFormData(prev => ({
      ...prev,
      attachments,
    }));
  }, [uploadedFiles]);

  const handleInputChange = (field: keyof CreateReceiptPaymentRequestDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReceiptSelect = (receiptId: string) => {
    const receipt = unpaidReceipts.find(r => r.id === receiptId);
    setSelectedReceipt(receipt || null);
  };

  const getPaymentObjectName = (expenseType: ReceiptPaymentExpenseType): string => {
    switch (expenseType) {
      case ReceiptPaymentExpenseType.TRANSPORTATION:
        return "Chi phí vận chuyển";
      case ReceiptPaymentExpenseType.UTILITIES:
        return "Chi phí tiện ích";
      case ReceiptPaymentExpenseType.RENT:
        return "Chi phí thuê mặt bằng";
      case ReceiptPaymentExpenseType.LABOR:
        return "Chi phí nhân công";
      case ReceiptPaymentExpenseType.OTHER:
        return "";
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(createReceiptPayment(formData)).unwrap();
      toast.success('Tạo phiếu chi thành công!');
      navigate('/receipt-payment');
    } catch (error: any) {
      console.error('Error creating receipt payment:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi tạo phiếu chi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <BreadCrumb title="Tạo phiếu chi" pageTitle="Phiếu chi" />
      <ToastContainer closeButton={false} limit={1} />

      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link
                to="/receipt-payment"
                className="flex items-center justify-center size-[37.5px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <h4 className="text-lg font-medium text-slate-700 dark:text-zink-100">
                Tạo phiếu chi mới
              </h4>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Payment Date */}
              <div>
                <label className="inline-block mb-2 text-base font-medium">
                  Ngày chi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  value={formData.paymentDate}
                  onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                  required
                />
              </div>

              {/* Expense Type */}
              <div>
                <label className="inline-block mb-2 text-base font-medium">
                  Loại chi phí <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  value={formData.expenseType}
                  onChange={(e) => handleInputChange('expenseType', e.target.value)}
                  required
                >
                  {expenseTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Expense Type Name (if OTHER) */}
              {formData.expenseType === ReceiptPaymentExpenseType.OTHER && (
                <div className="lg:col-span-2">
                  <label className="inline-block mb-2 text-base font-medium">
                    Tên loại chi phí <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                    placeholder="Nhập tên loại chi phí"
                    value={formData.expenseTypeName || ''}
                    onChange={(e) => handleInputChange('expenseTypeName', e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Supplier Payment Selection - Same row as Status */}
              {formData.expenseType === ReceiptPaymentExpenseType.SUPPLIER_PAYMENT && (
                <div>
                  <label className="inline-block mb-2 text-base font-medium">
                    Chọn phiếu nhập chưa thanh toán <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                    value={selectedReceipt?.id || ''}
                    onChange={(e) => handleReceiptSelect(e.target.value)}
                    required
                  >
                    <option value="">Chọn phiếu nhập</option>
                    {unpaidReceipts.map((receipt) => (
                      <option key={receipt.id} value={receipt.id}>
                        {receipt.code} - {receipt.supplier.name} - Còn lại: {receipt.remainingAmount.toLocaleString('vi-VN')}₫
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status - Same row as Supplier Payment Selection */}
              <div>
                <label className="inline-block mb-2 text-base font-medium">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Receipt Information Display - Full width */}
              {formData.expenseType === ReceiptPaymentExpenseType.SUPPLIER_PAYMENT && selectedReceipt && (
                <div className="lg:col-span-2">
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                    <div className="flex items-start gap-2">
                      <Info className="size-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                          Thông tin phiếu nhập: {selectedReceipt.code}
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 space-y-1">
                          <div>Nhà cung cấp: <span className="font-medium">{selectedReceipt.supplier.name}</span></div>
                          <div>Tổng tiền: <span className="font-medium">{selectedReceipt.totalAmount.toLocaleString('vi-VN')}₫</span></div>
                          <div>Đã thanh toán: <span className="font-medium">{selectedReceipt.paidAmount.toLocaleString('vi-VN')}₫</span></div>
                          <div>Còn lại: <span className="font-medium text-red-600">{selectedReceipt.remainingAmount.toLocaleString('vi-VN')}₫</span></div>
                          <div>Hạn thanh toán: <span className="font-medium">{new Date(selectedReceipt.dueDate).toLocaleDateString('vi-VN')}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Object - Same row as Status for non-supplier payments */}
              {formData.expenseType !== ReceiptPaymentExpenseType.SUPPLIER_PAYMENT && (
                <div>
                  <label className="inline-block mb-2 text-base font-medium">
                    Đối tượng chi
                  </label>
                  <input
                    type="text"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                    placeholder="Nhập tên đối tượng chi"
                    value={formData.paymentObject || getPaymentObjectName(formData.expenseType)}
                    onChange={(e) => handleInputChange('paymentObject', e.target.value)}
                  />
                </div>
              )}

              {/* Status - Same row as Payment Object for non-supplier payments */}
              {formData.expenseType !== ReceiptPaymentExpenseType.SUPPLIER_PAYMENT && (
                <div>
                  <label className="inline-block mb-2 text-base font-medium">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Amount with Money Input */}
              <div>
                <label className="inline-block mb-2 text-base font-medium">
                  Số tiền <span className="text-red-500">*</span>
                </label>
                <MoneyInput
                  value={formData.amount}
                  onChange={(value) => handleInputChange('amount', value)}
                  placeholder="Nhập số tiền"
                  required
                  min={0}
                />
              </div>

              {/* Payment Method - Only Cash and Bank Transfer */}
              <div>
                <label className="inline-block mb-2 text-base font-medium">
                  Phương thức thanh toán <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', parseInt(e.target.value))}
                  required
                >
                  {paymentMethodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>





              {/* Notes */}
              <div className="lg:col-span-2">
                <label className="inline-block mb-2 text-base font-medium">
                  Ghi chú
                </label>
                <textarea
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  rows={4}
                  placeholder="Nhập ghi chú (tùy chọn)"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>

              {/* File Upload */}
              <div className="lg:col-span-2">
                <label className="inline-block mb-2 text-base font-medium">
                  Đính kèm tài liệu
                </label>
                <FileUpload
                  files={uploadedFiles}
                  onFilesChange={setUploadedFiles}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  multiple={true}
                  maxSize={10}
                  maxFiles={5}
                />
                <p className="text-xs text-slate-500 dark:text-zink-300 mt-2">
                  Có thể tải lên hóa đơn, biên lai, hình ảnh chứng từ (tối đa 5 file, mỗi file không quá 10MB)
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Link
                to="/receipt-payment"
                className="text-slate-500 btn bg-slate-100 hover:text-slate-600 hover:bg-slate-200 focus:text-slate-600 focus:bg-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="inline-block size-4 mr-2" />
                    Lưu phiếu chi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReceiptPaymentCreate;