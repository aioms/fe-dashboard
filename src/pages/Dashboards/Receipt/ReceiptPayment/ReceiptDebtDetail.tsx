import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
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
  Mail,
  AlertTriangle,
  Building2,
  Clock,
  DollarSign,
  Package,
  Receipt,
  CheckCircle,
  XCircle
} from "lucide-react";
import { formatMoney } from "helpers/utils";
import {
  ReceiptDebt,
  ReceiptDebtStatus,
  ReceiptDebtType,
  PaymentMethod,
  TransactionStatus,
  PaymentStatus,
  PaymentTransaction
} from "types/receiptPayment";
import { getReceiptDebtDetail, getReceiptDebtPaymentHistory } from "slices/receipt-payment/thunk";
import DeleteModal from "Common/DeleteModal";

// Interface for receipt debt item
interface ReceiptDebtItem {
  id: string;
  receiptId: string;
  receiptPeriodId: string;
  productId: string;
  productCode: number;
  code: string;
  productName: string;
  quantity: number;
  inventory: number;
  discount: number;
  costPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for API response
interface ReceiptDebtDetailResponse {
  receipt: ReceiptDebt;
  items: Record<string, ReceiptDebtItem[]>;
}

// Status badge component
const DebtStatusBadge: React.FC<{ status: ReceiptDebtStatus }> = ({ status }) => {
  const statusConfig = {
    [ReceiptDebtStatus.DEBT]: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      darkBg: "dark:bg-orange-900",
      darkText: "dark:text-orange-300",
      label: "Công nợ"
    },
    [ReceiptDebtStatus.PENDING]: {
      bg: "bg-red-100",
      text: "text-red-800",
      darkBg: "dark:bg-red-900",
      darkText: "dark:text-red-300",
      label: "Chờ thanh toán"
    },
    [ReceiptDebtStatus.PARTIAL_PAID]: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      darkBg: "dark:bg-yellow-900",
      darkText: "dark:text-yellow-300",
      label: "Đã thu 1 phần"
    },
    [ReceiptDebtStatus.COMPLETED]: {
      bg: "bg-green-100",
      text: "text-green-800",
      darkBg: "dark:bg-green-900",
      darkText: "dark:text-green-300",
      label: "Hoàn thành"
    },
    [ReceiptDebtStatus.OVERDUE]: {
      bg: "bg-red-100",
      text: "text-red-800",
      darkBg: "dark:bg-red-900",
      darkText: "dark:text-red-300",
      label: "Trễ hạn"
    }
  };

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}`}
    >
      {config.label}
    </span>
  );
};

const ReceiptDebtDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  // Selector for payment history from Redux store
  const selectPaymentHistory = createSelector(
    (state: any) => state.ReceiptPayment,
    (state) => ({
      paymentHistory: state?.paymentHistory || null,
      paymentHistoryLoading: state?.paymentHistoryLoading || false,
    })
  );

  const { paymentHistory, paymentHistoryLoading } = useSelector(selectPaymentHistory);

  const [debt, setDebt] = useState<ReceiptDebt | null>(null);
  const [items, setItems] = useState<Record<string, ReceiptDebtItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchDebtDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dispatch(getReceiptDebtDetail(id!)).unwrap() as ReceiptDebtDetailResponse;
      setDebt(response.receipt);
      setItems(response.items || {});

      // Fetch payment history
      dispatch(getReceiptDebtPaymentHistory(id!));
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin công nợ");
    } finally {
      setLoading(false);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      fetchDebtDetail();
    }
  }, [id, fetchDebtDetail]);

  const handleEdit = () => {
    navigate(`/receipt-debt/edit/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendReminder = () => {
    // TODO: Implement send email reminder logic
    console.log("Sending email reminder for debt:", id);
  };

  const handleDelete = () => {
    // TODO: Implement delete logic
    console.log("Deleting debt:", id);
    setDeleteModal(false);
    navigate("/receipt-payment?tab=debt");
  };

  const handleAddPayment = () => {
    navigate(`/receipt-debt/payment/${id}`);
  };

  const isOverdue = () => {
    if (!debt || debt.status === ReceiptDebtStatus.COMPLETED) return false;
    return debt.dueDate && new Date(debt.dueDate) < new Date();
  };

  const canEdit = debt && debt.status !== ReceiptDebtStatus.COMPLETED;
  const canDelete = debt && debt.status !== ReceiptDebtStatus.COMPLETED;
  const canAddPayment = debt && debt.status !== ReceiptDebtStatus.COMPLETED && debt.remainingAmount > 0;

  // Helper function to get payment method label
  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH:
        return "Tiền mặt";
      case PaymentMethod.BANK_TRANSFER:
        return "Chuyển khoản";
      case PaymentMethod.CREDIT_CARD:
        return "Thẻ tín dụng";
      case PaymentMethod.CHECK:
        return "Séc";
      case PaymentMethod.E_WALLET:
        return "Ví điện tử";
      default:
        return "Không xác định";
    }
  };

  // Helper function to get transaction status label and style
  const getTransactionStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return {
          label: "Thành công",
          icon: CheckCircle,
          className: "text-green-600 bg-green-50 dark:bg-green-900/20"
        };
      case TransactionStatus.PENDING:
        return {
          label: "Đang xử lý",
          icon: Clock,
          className: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
        };
      case TransactionStatus.FAILED:
        return {
          label: "Thất bại",
          icon: XCircle,
          className: "text-red-600 bg-red-50 dark:bg-red-900/20"
        };
      case TransactionStatus.CANCELLED:
        return {
          label: "Đã hủy",
          icon: XCircle,
          className: "text-gray-600 bg-gray-50 dark:bg-gray-900/20"
        };
      default:
        return {
          label: "Không xác định",
          icon: AlertTriangle,
          className: "text-gray-600 bg-gray-50 dark:bg-gray-900/20"
        };
    }
  };

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
          onClick={fetchDebtDetail}
          className="px-4 py-2 bg-custom-500 text-white rounded-md hover:bg-custom-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!debt) {
    return (
      <div className="text-center py-8">
        <div className="text-slate-500">Không tìm thấy thông tin công nợ</div>
        <Link
          to="/receipt-payment?tab=debt"
          className="mt-4 inline-block px-4 py-2 bg-custom-500 text-white rounded-md hover:bg-custom-600"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const debtType = debt.type === ReceiptDebtType.CUSTOMER_DEBT ? "Nợ khách hàng" : "Nợ nhà cung cấp";
  const partnerName = debt.customerName || debt.supplierName || "N/A";
  const overdueStatus = isOverdue();
  const totalItems = Object.values(items).flat().length;

  return (
    <React.Fragment>
      <BreadCrumb title="Chi tiết công nợ" pageTitle="Quản lý công nợ" />

      <DeleteModal
        show={deleteModal}
        onHide={() => setDeleteModal(false)}
        onDelete={handleDelete}
      />

      <div className="card">
        <div className="card-body">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/receipt-payment?tab=debt")}
                className="flex items-center gap-2 text-slate-500 hover:text-custom-500"
              >
                <ArrowLeft className="size-4" />
                <span>Quay lại</span>
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-xl font-semibold text-slate-700 dark:text-zink-100">
                    {debt.code}
                  </h4>
                  {overdueStatus && (
                    <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                      <AlertTriangle className="size-4" />
                      Quá hạn
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-zink-200">
                  Chi tiết công nợ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canAddPayment && (
                <button
                  onClick={handleAddPayment}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 rounded-md"
                >
                  <DollarSign className="size-4" />
                  <span>Thêm đợt thanh toán</span>
                </button>
              )}

              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-custom-500 border-custom-500 hover:bg-custom-600 hover:border-custom-600 rounded-md"
                >
                  <Edit className="size-4" />
                  <span>Cập nhật</span>
                </button>
              )}

              <button
                onClick={handleSendReminder}
                className="flex items-center gap-2 px-4 py-2 text-blue-500 bg-white border border-blue-200 hover:bg-blue-50 rounded-md"
              >
                <Mail className="size-4" />
                <span>Gửi nhắc</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-md"
              >
                <Printer className="size-4" />
                <span>In phiếu</span>
              </button>

              {canDelete && (
                <button
                  onClick={() => setDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-red-500 bg-white border border-red-200 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="size-4" />
                  <span>Xóa</span>
                </button>
              )}
            </div>
          </div>

          {/* Overdue Warning */}
          {overdueStatus && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-medium text-red-800">Cảnh báo: Công nợ đã quá hạn</div>
                <div className="text-sm text-red-600 mt-1">
                  Hạn thanh toán: {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString('vi-VN') : ''}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="p-5 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">
                  Thông tin cơ bản
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="size-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zink-200">Hạn thanh toán</div>
                      <div className={`font-medium mt-1 ${overdueStatus ? "text-red-600" : "text-slate-700 dark:text-zink-100"}`}>
                        {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : "Chưa xác định"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="size-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zink-200">Loại công nợ</div>
                      <div className="font-medium text-slate-700 dark:text-zink-100 mt-1">
                        {debtType}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {debt.type === ReceiptDebtType.CUSTOMER_DEBT ? (
                      <User className="size-5 text-slate-400 mt-0.5" />
                    ) : (
                      <Building2 className="size-5 text-slate-400 mt-0.5" />
                    )}
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zink-200">
                        {debt.type === ReceiptDebtType.CUSTOMER_DEBT ? "Khách hàng" : "Nhà cung cấp"}
                      </div>
                      <div className="font-medium text-slate-700 dark:text-zink-100 mt-1">
                        {partnerName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zink-200">Ngày tạo</div>
                      <div className="font-medium text-slate-700 dark:text-zink-100 mt-1">
                        {new Date(debt.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="p-5 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">
                  Thông tin tài chính
                </h5>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-zink-700 rounded-lg border border-slate-200 dark:border-zink-500">
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zink-200">Tổng số tiền</div>
                      <div className="text-2xl font-bold text-slate-700 dark:text-zink-100 mt-1">
                        {formatMoney(debt.totalAmount)} VND
                      </div>
                    </div>
                    <CreditCard className="size-8 text-slate-300" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-sm text-green-600 dark:text-green-400">Đã thanh toán</div>
                      <div className="text-xl font-semibold text-green-700 dark:text-green-300 mt-1">
                        {formatMoney(debt.paidAmount)} VND
                      </div>
                      {debt.paymentDate && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Ngày thanh toán: {new Date(debt.paymentDate).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="text-sm text-orange-600 dark:text-orange-400">Còn lại</div>
                      <div className="text-xl font-semibold text-orange-700 dark:text-orange-300 mt-1">
                        {formatMoney(debt.remainingAmount)} VND
                      </div>
                      {debt.remainingAmount > 0 && (
                        <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                          {((debt.remainingAmount / debt.totalAmount) * 100).toFixed(1)}% chưa thanh toán
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-5 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">
                  Ghi chú
                </h5>

                <div className="p-4 bg-white dark:bg-zink-700 rounded-lg border border-slate-200 dark:border-zink-500 min-h-[100px]">
                  {debt.note ? (
                    <p className="text-slate-700 dark:text-zink-100 whitespace-pre-wrap">
                      {debt.note}
                    </p>
                  ) : (
                    <span className="text-slate-400 dark:text-zink-300 italic">
                      Không có ghi chú
                    </span>
                  )}
                </div>
              </div>

              {/* Collection Period Items */}
              {Object.keys(items).length > 0 && (
                <div className="p-5 bg-slate-50 dark:bg-zink-600 rounded-lg">
                  <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4 flex items-center gap-2">
                    <Package className="size-5" />
                    Chi tiết đợt thu
                  </h5>

                  <div className="space-y-4">
                    {Object.entries(items).sort(([dateA], [dateB]) =>
                      new Date(dateB).getTime() - new Date(dateA).getTime()
                    ).map(([date, dateItems]) => (
                      <div key={date} className="border border-slate-200 dark:border-zink-500 rounded-lg overflow-hidden">
                        {/* Date Header */}
                        <div className="px-4 py-2 bg-white dark:bg-zink-700 border-b border-slate-200 dark:border-zink-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-slate-500" />
                            <span className="font-medium text-slate-700 dark:text-zink-100">
                              {new Date(date).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-zink-200">
                              ({dateItems.length} sản phẩm)
                            </span>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-white dark:bg-zink-700">
                          {dateItems.map((item, index) => (
                            <div
                              key={item.id}
                              className={`px-4 py-3 ${
                                index !== dateItems.length - 1
                                  ? 'border-b border-slate-100 dark:border-zink-600'
                                  : ''
                              }`}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Product Info */}
                                <div>
                                  <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                      <div className="font-medium text-slate-700 dark:text-zink-100">
                                        {item.productName}
                                      </div>
                                      <div className="text-sm text-slate-500 dark:text-zink-200 mt-1">
                                        Mã: <span className="font-mono">{item.code}</span>
                                        {" • "}
                                        Mã SP: <span className="font-mono">{item.productCode}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Quantity & Price Info */}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <div className="text-slate-500 dark:text-zink-200">Số lượng</div>
                                    <div className="font-semibold text-slate-700 dark:text-zink-100">
                                      {item.quantity}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-500 dark:text-zink-200">Tồn kho</div>
                                    <div className="font-semibold text-slate-700 dark:text-zink-100">
                                      {item.inventory}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-500 dark:text-zink-200">Đơn giá</div>
                                    <div className="font-semibold text-slate-700 dark:text-zink-100">
                                      {formatMoney(item.costPrice)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-500 dark:text-zink-200">Giảm giá</div>
                                    <div className="font-semibold text-orange-600 dark:text-orange-400">
                                      {item.discount > 0 ? formatMoney(item.discount) : '-'}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Total for this item */}
                              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-zink-600 flex justify-between items-center">
                                <span className="text-sm text-slate-500 dark:text-zink-200">
                                  Thành tiền:
                                </span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                  {formatMoney((item.costPrice * item.quantity) - item.discount)} VND
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Date Summary */}
                        <div className="px-4 py-2 bg-slate-50 dark:bg-zink-600 border-t border-slate-200 dark:border-zink-500">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600 dark:text-zink-200">
                              Tổng ngày {new Date(date).toLocaleDateString('vi-VN')}:
                            </span>
                            <span className="font-bold text-slate-700 dark:text-zink-100">
                              {formatMoney(
                                dateItems.reduce((sum, item) =>
                                  sum + ((item.costPrice * item.quantity) - item.discount), 0
                                )
                              )} VND
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grand Total Summary */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-custom-500 to-custom-600 rounded-lg">
                    <div className="flex justify-between items-center text-white">
                      <span className="font-semibold text-lg">
                        Tổng cộng tất cả các đợt:
                      </span>
                      <span className="font-bold text-2xl">
                        {formatMoney(
                          Object.values(items).flat().reduce((sum, item) =>
                            sum + ((item.costPrice * item.quantity) - item.discount), 0
                          )
                        )} VND
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Status & Actions */}
            <div className="space-y-6">
              {/* Status */}
              <div className="p-5 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">
                  Trạng thái
                </h5>

                <div className="flex justify-center">
                  <DebtStatusBadge status={debt.status} />
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-zink-200 mb-2">
                    <span>Tiến độ thanh toán</span>
                    <span className="font-medium">
                      {debt.totalAmount > 0
                        ? ((debt.paidAmount / debt.totalAmount) * 100).toFixed(0)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-zink-700">
                    <div
                      className={`h-2.5 rounded-full ${
                        debt.status === ReceiptDebtStatus.COMPLETED
                          ? 'bg-green-500'
                          : debt.status === ReceiptDebtStatus.PARTIAL_PAID
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${debt.totalAmount > 0 ? (debt.paidAmount / debt.totalAmount) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="p-5 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4 flex items-center gap-2">
                  <Receipt className="size-5" />
                  Lịch sử thanh toán
                </h5>

                {paymentHistoryLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-500"></div>
                  </div>
                ) : paymentHistory && paymentHistory.payment ? (
                  <div className="space-y-4">
                    {/* Payment Summary */}
                    <div className="p-4 bg-white dark:bg-zink-700 rounded-lg border border-slate-200 dark:border-zink-500">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-sm text-slate-500 dark:text-zink-200">Mã thanh toán</div>
                          <div className="font-mono font-medium text-slate-700 dark:text-zink-100 mt-1">
                            {paymentHistory.payment.code}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          paymentHistory.payment.status === PaymentStatus.COMPLETED
                            ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                            : "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
                        }`}>
                          {paymentHistory.payment.status === PaymentStatus.COMPLETED
                            ? "Hoàn thành"
                            : "Đang xử lý"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-slate-500 dark:text-zink-200">Tổng số tiền</div>
                          <div className="font-semibold text-slate-700 dark:text-zink-100">
                            {formatMoney(paymentHistory.payment.totalAmount)} VND
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 dark:text-zink-200">Đã thu</div>
                          <div className="font-semibold text-green-600 dark:text-green-400">
                            {formatMoney(paymentHistory.payment.collectedAmount)} VND
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 dark:text-zink-200">Còn lại</div>
                          <div className="font-semibold text-orange-600 dark:text-orange-400">
                            {formatMoney(paymentHistory.payment.outstandingAmount)} VND
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 dark:text-zink-200">Ngày tạo</div>
                          <div className="font-medium text-slate-700 dark:text-zink-100">
                            {new Date(paymentHistory.payment.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transactions */}
                    {paymentHistory.transactions && paymentHistory.transactions.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-slate-600 dark:text-zink-200">
                          Giao dịch ({paymentHistory.transactions.length})
                        </div>
                        {paymentHistory.transactions.map((transaction: PaymentTransaction) => {
                          const statusConfig = getTransactionStatusConfig(transaction.status);
                          const StatusIcon = statusConfig.icon;

                          return (
                            <div
                              key={transaction.id}
                              className="p-3 bg-white dark:bg-zink-700 rounded-lg border border-slate-200 dark:border-zink-500"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="font-mono text-sm text-slate-700 dark:text-zink-100">
                                    {transaction.code}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-zink-200 mt-1">
                                    {transaction.description}
                                  </div>
                                </div>
                                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${statusConfig.className}`}>
                                  <StatusIcon className="size-3" />
                                  {statusConfig.label}
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-xs mt-2 pt-2 border-t border-slate-100 dark:border-zink-600">
                                <div>
                                  <div className="text-slate-500 dark:text-zink-200">Số tiền</div>
                                  <div className="font-semibold text-slate-700 dark:text-zink-100">
                                    {formatMoney(transaction.amount)} VND
                                  </div>
                                </div>
                                <div>
                                  <div className="text-slate-500 dark:text-zink-200">Phương thức</div>
                                  <div className="font-medium text-slate-700 dark:text-zink-100">
                                    {getPaymentMethodLabel(transaction.paymentMethod)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-slate-500 dark:text-zink-200">Thời gian</div>
                                  <div className="font-medium text-slate-700 dark:text-zink-100">
                                    {new Date(transaction.processedAt).toLocaleDateString('vi-VN')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400 dark:text-zink-300 text-sm">
                    Chưa có thanh toán nào
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="p-5 bg-slate-50 dark:bg-zink-600 rounded-lg">
                <h5 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">
                  Thao tác nhanh
                </h5>

                <div className="space-y-2">
                  {canAddPayment && (
                    <button
                      onClick={handleAddPayment}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
                    >
                      <DollarSign className="size-4" />
                      <span>Thêm đợt thanh toán</span>
                    </button>
                  )}

                  <button
                    onClick={handleSendReminder}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                  >
                    <Mail className="size-4" />
                    <span>Gửi email nhắc nhở</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-slate-600 bg-white hover:bg-slate-50 dark:bg-zink-700 dark:hover:bg-zink-600 border border-slate-200 dark:border-zink-500 rounded-md transition-colors"
                  >
                    <Printer className="size-4" />
                    <span>In phiếu công nợ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReceiptDebtDetail;
