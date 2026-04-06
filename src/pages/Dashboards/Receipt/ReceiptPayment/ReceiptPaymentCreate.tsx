import React, { useState, useEffect } from "react";
import BreadCrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft, Save } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Components
import { FileUpload, UploadedFile } from "Common/Components/FileUpload";
import { MoneyInput } from "Common/Components/MoneyInput";
import { SupplierSelect } from "Common/Components/Select/SupplierSelect";
import { SupplierSelector } from "./components/SupplierSelector";
import { ReceiptImportSelector } from "./components/ReceiptImportSelector";

// Types and actions
import {
  CreateReceiptPaymentRequestDto,
  ReceiptPaymentExpenseType,
  ReceiptPaymentStatus,
  PaymentMethod,
  Attachment,
  UnpaidReceiptImport,
  UnpaidReceiptImportListResponse
} from "types/receiptPayment";
import { createReceiptPayment, getUnpaidReceipts } from "slices/receipt-payment/thunk";

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
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [selectedSupplierName, setSelectedSupplierName] = useState<string>("");
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<string[]>([]);
  const [unpaidReceipts, setUnpaidReceipts] = useState<UnpaidReceiptImport[]>([]);
  const [useSupplierForPaymentObject, setUseSupplierForPaymentObject] = useState(false);
  const [paymentObjectSupplierId, setPaymentObjectSupplierId] = useState<string | null>(null);
  const [paymentObjectSupplierName, setPaymentObjectSupplierName] = useState<string>("");

  // Load unpaid receipts when supplier is selected
  useEffect(() => {
    if (formData.expenseType === ReceiptPaymentExpenseType.SUPPLIER_PAYMENT && selectedSupplierId) {
      setLoadingReceipts(true);
      dispatch(getUnpaidReceipts(selectedSupplierId))
        .unwrap()
        .then((response: UnpaidReceiptImportListResponse) => {
          setUnpaidReceipts(response.data || []);
        })
        .catch((error: any) => {
          console.error('Error loading unpaid receipts:', error);
          toast.error('Không thể tải danh sách phiếu nhập chưa thanh toán');
          setUnpaidReceipts([]);
        })
        .finally(() => {
          setLoadingReceipts(false);
        });
    } else {
      setUnpaidReceipts([]);
      setSelectedReceiptIds([]);
    }
  }, [selectedSupplierId, formData.expenseType, dispatch]);

  // Reset supplier and receipts when expense type changes
  useEffect(() => {
    if (formData.expenseType !== ReceiptPaymentExpenseType.SUPPLIER_PAYMENT) {
      setSelectedSupplierId(null);
      setSelectedSupplierName("");
      setSelectedReceiptIds([]);
      setUnpaidReceipts([]);
      setUseSupplierForPaymentObject(false);
      setPaymentObjectSupplierId(null);
      setPaymentObjectSupplierName("");
      setFormData(prev => ({
        ...prev,
        receiptImportIds: undefined,
        supplierId: undefined,
        paymentObject: getPaymentObjectName(prev.expenseType),
      }));
    }
  }, [formData.expenseType]);

  // Update form data when supplier or receipts are selected
  useEffect(() => {
    if (formData.expenseType === ReceiptPaymentExpenseType.SUPPLIER_PAYMENT) {
      if (selectedSupplierId && selectedReceiptIds.length > 0) {
        const selectedReceipts = unpaidReceipts.filter(r => selectedReceiptIds.includes(r.id));
        const totalAmount = selectedReceipts.reduce((sum, r) => sum + r.totalAmount, 0);
        const receiptNumbers = selectedReceipts.map(r => r.receiptNumber).join(', ');
        const supplierName = selectedReceipts[0]?.supplier.name || '';

        setFormData(prev => ({
          ...prev,
          supplierId: selectedSupplierId,
          receiptImportIds: selectedReceiptIds,
          paymentObject: `${receiptNumbers} - ${supplierName}`,
          amount: totalAmount,
        }));
      } else if (selectedSupplierId) {
        setFormData(prev => ({
          ...prev,
          supplierId: selectedSupplierId,
          receiptImportIds: undefined,
          paymentObject: undefined,
          amount: 0,
        }));
      }
    }
  }, [selectedSupplierId, selectedReceiptIds, unpaidReceipts, formData.expenseType]);

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

  const handleSupplierChange = (supplierId: string | null, supplierName: string) => {
    setSelectedSupplierId(supplierId);
    setSelectedSupplierName(supplierName);
    setSelectedReceiptIds([]);
  };

  const handleReceiptSelectionChange = (receiptIds: string[]) => {
    setSelectedReceiptIds(receiptIds);
  };

  const handlePaymentObjectSupplierChange = (supplierId: string | null, supplierName: string) => {
    setPaymentObjectSupplierId(supplierId);
    setPaymentObjectSupplierName(supplierName);
    if (supplierId) {
      setFormData(prev => ({
        ...prev,
        supplierId,
        paymentObject: supplierName,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        supplierId: undefined,
        paymentObject: getPaymentObjectName(formData.expenseType),
      }));
    }
  };

  const handleUseSupplierCheckboxChange = (checked: boolean) => {
    setUseSupplierForPaymentObject(checked);
    if (!checked) {
      setPaymentObjectSupplierId(null);
      setPaymentObjectSupplierName("");
      setFormData(prev => ({
        ...prev,
        supplierId: undefined,
        paymentObject: getPaymentObjectName(formData.expenseType),
      }));
    }
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

    // Validate supplier payment
    if (formData.expenseType === ReceiptPaymentExpenseType.SUPPLIER_PAYMENT) {
      if (!selectedSupplierId) {
        toast.error('Vui lòng chọn nhà cung cấp');
        return;
      }
      if (selectedReceiptIds.length === 0) {
        toast.error('Vui lòng chọn ít nhất một phiếu nhập');
        return;
      }
    }

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

              {/* Supplier Selection */}
              {formData.expenseType === ReceiptPaymentExpenseType.SUPPLIER_PAYMENT && (
                <>
                  <SupplierSelector
                    value={selectedSupplierId}
                    label={selectedSupplierName}
                    onChange={handleSupplierChange}
                  />

                  {/* Status - Same row as Supplier Selection */}
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
                </>
              )}

              {/* Receipt Import Selection - Full width */}
              {formData.expenseType === ReceiptPaymentExpenseType.SUPPLIER_PAYMENT && selectedSupplierId && (
                <div className="lg:col-span-2">
                  <ReceiptImportSelector
                    receipts={unpaidReceipts}
                    selectedReceiptIds={selectedReceiptIds}
                    onSelectionChange={handleReceiptSelectionChange}
                    loading={loadingReceipts}
                  />
                </div>
              )}

              {/* Payment Object - Same row as Status for non-supplier payments */}
              {formData.expenseType !== ReceiptPaymentExpenseType.SUPPLIER_PAYMENT && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="inline-block text-base font-medium">
                      Đối tượng chi
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="size-4 border rounded border-slate-200 dark:border-zink-500 text-custom-500 focus:ring focus:ring-custom-100 dark:focus:ring-custom-500/20"
                        checked={useSupplierForPaymentObject}
                        onChange={(e) => handleUseSupplierCheckboxChange(e.target.checked)}
                      />
                      <span className="ml-1.5 text-sm text-slate-600 dark:text-zink-300">
                        Chọn từ NCC
                      </span>
                    </label>
                  </div>
                  {useSupplierForPaymentObject ? (
                    <SupplierSelect
                      value={paymentObjectSupplierId ? { value: paymentObjectSupplierId, label: paymentObjectSupplierName } : null}
                      onChange={(option: any) => handlePaymentObjectSupplierChange(option?.value || null, option?.label || "")}
                      isClearable={true}
                      placeholder="Tìm kiếm và chọn nhà cung cấp"
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                      placeholder="Nhập tên đối tượng chi"
                      value={formData.paymentObject || getPaymentObjectName(formData.expenseType)}
                      onChange={(e) => handleInputChange('paymentObject', e.target.value)}
                    />
                  )}
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

              {/* File Upload - Temporarily Hidden */}
              {false && (
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
              )}
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