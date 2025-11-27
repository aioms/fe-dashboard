import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Package, FileText } from "lucide-react";
import { toast } from "react-toastify";

import BreadCrumb from "Common/BreadCrumb";
import withRouter from "Common/withRouter";
import { getOrder } from "apis/order";
import { formatDateTime, formatMoney } from "helpers/utils";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  OrderStatus,
} from "Common/constants/order-constant";

import "./OrderDetail.css";

interface OrderDetailData {
  id: string;
  code: string;
  customer: {
    id: string;
    name: string;
  };
  paymentMethod: string;
  note: string;
  discountAmount: number;
  totalAmount: number;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
  vatInfo: {
    vatRate: number;
    vatAmount: number;
  };
  status: string;
  createdAt: string;
}

const OrderDetail = (props: any) => {
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) {
        setError("Order ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getOrder(id);
        setOrderData(response);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order details");
        toast.error("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const handleBackToList = () => {
    props.router.navigate("/orders");
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      [OrderStatus.DRAFT]: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        darkBg: "dark:bg-gray-900",
        darkText: "dark:text-gray-300",
      },
      [OrderStatus.PENDING]: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        darkBg: "dark:bg-yellow-900",
        darkText: "dark:text-yellow-300",
      },
      [OrderStatus.CANCELLED]: {
        bg: "bg-red-100",
        text: "text-red-800",
        darkBg: "dark:bg-red-900",
        darkText: "dark:text-red-300",
      },
      [OrderStatus.COMPLETED]: {
        bg: "bg-green-100",
        text: "text-green-800",
        darkBg: "dark:bg-green-900",
        darkText: "dark:text-green-300",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return status;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}`}
      >
        {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ||
          status}
      </span>
    );
  };

  if (loading) {
    return (
      <React.Fragment>
        <BreadCrumb title="Chi tiết đơn hàng" pageTitle="Orders" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-500 mx-auto"></div>
            <p className="mt-4 text-slate-500">
              Đang tải thông tin đơn hàng...
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }

  if (error || !orderData) {
    return (
      <React.Fragment>
        <BreadCrumb title="Chi tiết đơn hàng" pageTitle="Orders" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {error || "Không tìm thấy đơn hàng"}
            </p>
            <button
              onClick={handleBackToList}
              className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600"
            >
              <ArrowLeft className="inline-block size-4 mr-1" />
              Quay lại danh sách
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <BreadCrumb title="Chi tiết đơn hàng" pageTitle="Orders" />

      {/* Header with back button */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-slate-500 hover:text-custom-500 transition-colors"
              >
                <ArrowLeft className="size-4" />
                <span>Quay lại danh sách</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Trạng thái:</span>
              {getStatusBadge(orderData.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Order General Information */}
      <div className="card mb-4">
        <div className="card-header order-detail-card-header">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-custom-500" />
            <h6 className="text-15 grow">Thông tin chung đơn hàng</h6>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="inline-block mb-2 text-base font-medium">
                Mã đơn hàng
              </label>
              <p className="text-slate-800 dark:text-zink-100 font-semibold">
                {orderData.code}
              </p>
            </div>
            <div>
              <label className="inline-block mb-2 text-base font-medium">
                Khách hàng
              </label>
              <p className="text-slate-800 dark:text-zink-100">
                {orderData.customer?.name || "Khách lẻ"}
              </p>
            </div>
            <div>
              <label className="inline-block mb-2 text-base font-medium">
                Phương thức thanh toán
              </label>
              <p className="text-slate-800 dark:text-zink-100">
                {PAYMENT_METHOD_LABELS[
                  orderData.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
                ] || orderData.paymentMethod}
              </p>
            </div>
            <div>
              <label className="inline-block mb-2 text-base font-medium">
                Ngày tạo
              </label>
              <p className="text-slate-800 dark:text-zink-100">
                {formatDateTime(orderData.createdAt, true)}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="inline-block mb-2 text-base font-medium">
                Ghi chú
              </label>
              <p className="text-slate-800 dark:text-zink-100">
                {orderData.note || "Không có ghi chú"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card mb-4">
        <div className="card-header order-detail-card-header">
          <div className="flex items-center gap-2">
            <Package className="size-5 text-custom-500" />
            <h6 className="text-15 grow">Danh sách sản phẩm</h6>
          </div>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="ltr:text-left rtl:text-right bg-slate-100 text-slate-500 dark:text-zink-200 dark:bg-zink-600">
                <tr>
                  <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                    STT
                  </th>
                  <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                    Tên sản phẩm
                  </th>
                  <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                    Số lượng
                  </th>
                  <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                    Đơn giá
                  </th>
                  <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                      {index + 1}
                    </td>
                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                      <div className="font-medium text-slate-800 dark:text-zink-100">
                        {item.productName}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                      {item.quantity}
                    </td>
                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                      {formatMoney(item.price)}
                    </td>
                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500 font-medium">
                      {formatMoney(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="card">
        <div className="card-header order-detail-card-header">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-custom-500" />
            <h6 className="text-15 grow">Thông tin thanh toán</h6>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-zink-500">
                <span className="text-slate-600 dark:text-zink-200">
                  Tạm tính:
                </span>
                <span className="font-medium text-slate-800 dark:text-zink-100">
                  {formatMoney(
                    orderData.totalAmount + orderData.discountAmount
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-zink-500">
                <span className="text-slate-600 dark:text-zink-200">
                  Giảm giá:
                </span>
                <span className="font-medium text-red-500">
                  -{formatMoney(orderData.discountAmount)}
                </span>
              </div>
              {orderData.vatInfo && (
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-zink-500">
                  <span className="text-slate-600 dark:text-zink-200">
                    VAT ({orderData.vatInfo.vatRate}%):
                  </span>
                  <span className="font-medium text-slate-800 dark:text-zink-100">
                    {formatMoney(orderData.vatInfo.vatAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 border-t-2 border-slate-300 dark:border-zink-400">
                <span className="text-lg font-semibold text-slate-800 dark:text-zink-100">
                  Tổng cộng:
                </span>
                <span className="text-lg font-bold text-custom-500">
                  {formatMoney(orderData.totalAmount)}
                </span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-zink-600 p-4 rounded-lg">
              <h6 className="text-base font-medium mb-3 text-slate-800 dark:text-zink-100">
                Thông tin thanh toán
              </h6>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-zink-200">
                    Phương thức:
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-zink-100">
                    {PAYMENT_METHOD_LABELS[
                      orderData.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
                    ] || orderData.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-zink-200">
                    Trạng thái:
                  </span>
                  <span className="text-sm">
                    {getStatusBadge(orderData.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(OrderDetail);
