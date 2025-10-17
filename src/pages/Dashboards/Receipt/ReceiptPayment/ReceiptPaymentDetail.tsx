import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import BreadCrumb from "Common/BreadCrumb";
import {
  ArrowLeft,
  Edit,
  Printer,
  Trash2,
  Calendar,
  FileText,
  User,
  CreditCard,
  Paperclip
} from "lucide-react";
import { formatMoney, parseCurrencyInput } from "helpers/utils";
import { ReceiptPayment, PaymentMethod, ReceiptPaymentStatus } from "types/receiptPayment";
import { getReceiptPaymentDetail, updateReceiptPayment } from "slices/receipt-payment/thunk";
import PaymentStatusBadge from "./components/PaymentStatusBadge";
import ExpenseTypeBadge from "./components/ExpenseTypeBadge";
import DeleteModal from "Common/DeleteModal";

const ReceiptPaymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const [payment, setPayment] = useState<ReceiptPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    paymentDate: "",
    amount: 0,
    amountDisplay: "", // For formatted display
    paymentMethod: PaymentMethod.CASH,
    notes: "",
    status: ReceiptPaymentStatus.DRAFT
  });

  const fetchPaymentDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dispatch(getReceiptPaymentDetail(id!)).unwrap();
      setPayment(response);

      // Initialize edit form
      setEditForm({
        paymentDate: response.paymentDate.split('T')[0], // Format for date input
        amount: response.amount,
        amountDisplay: formatMoney(response.amount),
        paymentMethod: response.paymentMethod,
        notes: response.notes || "",
        status: response.status
      });
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin phiếu chi");
    } finally {
      setLoading(false);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      fetchPaymentDetail();
    }
  }, [id, fetchPaymentDetail]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (payment) {
      setEditForm({
        paymentDate: payment.paymentDate.split('T')[0],
        amount: payment.amount,
        amountDisplay: formatMoney(payment.amount),
        paymentMethod: payment.paymentMethod,
        notes: payment.notes || "",
        status: payment.status
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updateData = {
        paymentDate: editForm.paymentDate,
        amount: editForm.amount,
        paymentMethod: editForm.paymentMethod,
        notes: editForm.notes,
        status: editForm.status
      };

      await dispatch(updateReceiptPayment({
        id: id!,
        data: updateData
      })).unwrap();

      // Update the payment state with the form data since API doesn't return updated data
      if (payment) {
        setPayment({
          ...payment,
          paymentDate: editForm.paymentDate,
          amount: editForm.amount,
          paymentMethod: editForm.paymentMethod,
          notes: editForm.notes,
          status: editForm.status,
          updatedAt: new Date().toISOString() // Update the timestamp
        });
      }

      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật phiếu chi");
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH:
        return "Tiền mặt";
      case PaymentMethod.BANK_TRANSFER:
        return "Chuyển khoản";
      default:
        return "Không xác định";
    }
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseCurrencyInput(value);
    setEditForm(prev => ({
      ...prev,
      amount: numericValue,
      amountDisplay: formatMoney(numericValue)
    }));
  };

  const canEdit = payment && (payment.status === ReceiptPaymentStatus.DRAFT || payment.status === ReceiptPaymentStatus.DEBT_PAYMENT);
  const canDelete = payment && (payment.status === ReceiptPaymentStatus.DRAFT || payment.status === ReceiptPaymentStatus.DEBT_PAYMENT);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-custom-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Có lỗi xảy ra</div>
        <div className="text-sm text-slate-500 mb-4">{error}</div>
        <button
          onClick={fetchPaymentDetail}
          className="px-4 py-2 bg-custom-500 text-white rounded-md hover:bg-custom-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-8">
        <div className="text-slate-500">Không tìm thấy phiếu chi</div>
        <Link
          to="/receipt-payment"
          className="mt-4 inline-block px-4 py-2 bg-custom-500 text-white rounded-md hover:bg-custom-600"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <React.Fragment>
      <BreadCrumb title="Chi tiết phiếu chi" pageTitle="Phiếu chi" />

      <DeleteModal
        show={deleteModal}
        onHide={() => setDeleteModal(false)}
        onDelete={() => {
          // Handle delete logic here
          setDeleteModal(false);
          navigate("/receipt-payment");
        }}
      />

      <div className="card">
        <div className="card-body">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/receipt-payment")}
                className="flex items-center gap-2 text-slate-500 hover:text-custom-500"
              >
                <ArrowLeft className="size-4" />
                <span>Quay lại</span>
              </button>
              <div>
                <h4 className="text-xl font-semibold text-slate-700 dark:text-zink-100">
                  {payment.code}
                </h4>
                <p className="text-sm text-slate-500 dark:text-zink-200">
                  Chi tiết phiếu chi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canEdit && (
                <button
                  onClick={isEditing ? handleSaveEdit : handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-custom-500 border-custom-500 hover:bg-custom-600 hover:border-custom-600 rounded-md"
                >
                  <Edit className="size-4" />
                  <span>{isEditing ? "Lưu" : "Sửa phiếu"}</span>
                </button>
              )}

              {isEditing && (
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-md"
                >
                  <span>Hủy</span>
                </button>
              )}

              <button className="flex items-center gap-2 px-4 py-2 text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-md">
                <Printer className="size-4" />
                <span>In phiếu</span>
              </button>

              {canDelete && (
                <button
                  onClick={() => setDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-red-500 bg-white border border-red-200 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="size-4" />
                  <span>Hủy phiếu</span>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="p-4 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">
                  Thông tin cơ bản
                </h5>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="size-5 text-slate-400" />
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zink-200">Ngày chi</div>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editForm.paymentDate}
                          onChange={(e) => setEditForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                          className="mt-1 form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                        />
                      ) : (
                        <div className="font-medium text-slate-700 dark:text-zink-100">
                          {new Date(payment.paymentDate).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-slate-400" />
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zink-200">Loại chi phí</div>
                      <ExpenseTypeBadge
                        type={payment.expenseType}
                        customName={payment.expenseTypeName}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="size-5 text-slate-400" />
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zink-200">Đối tượng chi</div>
                      <div className="font-medium text-slate-700 dark:text-zink-100">
                        {payment.paymentObject || payment.supplier?.name || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="p-4 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">
                  Thông tin thanh toán
                </h5>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 text-xs font-semibold text-slate-400 bg-slate-100 rounded">
                      ₫
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 dark:text-zink-200">Số tiền</div>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={editForm.amountDisplay}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="mt-1 form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 pr-12"
                            placeholder="0"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                            VND
                          </span>
                        </div>
                      ) : (
                        <div className="text-xl font-semibold text-slate-700 dark:text-zink-100">
                          {formatMoney(payment.amount)} VND
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="size-5 text-slate-400" />
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zink-200">Phương thức thanh toán</div>
                      {isEditing ? (
                        <select
                          value={editForm.paymentMethod}
                          onChange={(e) => setEditForm(prev => ({ ...prev, paymentMethod: Number(e.target.value) as PaymentMethod }))}
                          className="mt-1 form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                        >
                          <option value={PaymentMethod.CASH}>Tiền mặt</option>
                          <option value={PaymentMethod.BANK_TRANSFER}>Chuyển khoản</option>
                        </select>
                      ) : (
                        <div className="font-medium text-slate-700 dark:text-zink-100">
                          {getPaymentMethodLabel(payment.paymentMethod)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status and Notes */}
              <div className="p-4 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">
                  Trạng thái và ghi chú
                </h5>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-500 dark:text-zink-200 mb-2">Trạng thái</div>
                    {isEditing ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as ReceiptPaymentStatus }))}
                        className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                      >
                        <option value={ReceiptPaymentStatus.DRAFT}>Nháp</option>
                        <option value={ReceiptPaymentStatus.PAID}>Đã chi</option>
                        <option value={ReceiptPaymentStatus.DEBT_PAYMENT}>Nợ chi</option>
                      </select>
                    ) : (
                      <PaymentStatusBadge status={payment.status} />
                    )}
                  </div>

                  <div>
                    <div className="text-sm text-slate-500 dark:text-zink-200 mb-2">Ghi chú</div>
                    {isEditing ? (
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                        rows={4}
                        className="form-textarea border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                        placeholder="Nhập ghi chú..."
                      />
                    ) : (
                      <div className="p-3 bg-white dark:bg-zink-700 rounded border border-slate-200 dark:border-zink-500 min-h-[100px]">
                        {payment.notes || (
                          <span className="text-slate-400 dark:text-zink-300 italic">
                            Không có ghi chú
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {payment.attachments && payment.attachments.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-zink-600 rounded-lg">
                  <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4 flex items-center gap-2">
                    <Paperclip className="size-5" />
                    File đính kèm
                  </h5>

                  <div className="space-y-2">
                    {payment.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-3 p-3 bg-white dark:bg-zink-700 rounded border border-slate-200 dark:border-zink-500">
                        <FileText className="size-4 text-slate-400" />
                        <div className="flex-1">
                          <div className="font-medium text-slate-700 dark:text-zink-100">
                            {attachment.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-zink-200">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                        <button className="text-custom-500 hover:text-custom-600">
                          Xem
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="p-4 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">
                  Thông tin khác
                </h5>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-zink-200">Ngày tạo:</span>
                    <span className="text-slate-700 dark:text-zink-100">
                      {new Date(payment.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-zink-200">Cập nhật lần cuối:</span>
                    <span className="text-slate-700 dark:text-zink-100">
                      {payment.updatedAt ? new Date(payment.updatedAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReceiptPaymentDetail;