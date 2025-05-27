import React from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "helpers/utils";
import { getDate } from "helpers/date";
import { NoTableResult } from "Common/Components/NoTableResult";
import { ReceiptStatus as ReceiptImportStatus } from "pages/Dashboards/Receipt/ReceiptImport/components/ReceiptStatus";
import { ReceiptStatus as ReceiptReturnStatus } from "pages/Dashboards/Receipt/ReceiptReturn/components/ReceiptStatus";

export interface ReceiptImport {
  id: string;
  receiptNumber: string;
  importDate: string;
  totalProduct: number;
  totalAmount: number;
  status: string;
  paymentDate: string;
}

export interface ReceiptReturn {
  id: string;
  receiptNumber: string;
  returnDate: string;
  totalProduct: number;
  totalAmount: number;
  status: string;
}

interface TransactionTableProps {
  receiptImports: ReceiptImport[];
  receiptReturns: ReceiptReturn[];
  totalDebt: number;
  onLoadMore: (type: "import" | "return") => void;
  hasMoreImports: boolean;
  hasMoreReturns: boolean;
  loadingMore: boolean;
}

const PaymentStatusBadge: React.FC<{ paymentDate?: string }> = ({
  paymentDate,
}) => {
  if (!paymentDate) {
    return (
      <span className="px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20">
        Không áp dụng
      </span>
    );
  }

  const isPaid = getDate(paymentDate).isBefore(getDate());

  return isPaid ? (
    <span className="px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20">
      Đã thanh toán
    </span>
  ) : (
    <span className="px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-yellow-100 border-yellow-200 text-yellow-500 dark:bg-yellow-500/20 dark:border-yellow-500/20">
      Chưa thanh toán
    </span>
  );
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
  receiptImports,
  receiptReturns,
  totalDebt,
  onLoadMore,
  hasMoreImports,
  hasMoreReturns,
  loadingMore,
}) => {
  const renderTransactionTable = (
    transactions: ReceiptImport[] | ReceiptReturn[],
    type: "import" | "return",
    hasMore: boolean
  ) => (
    <div className="card">
      <div className="card-body">
        <h6 className="text-15 mb-3">
          {type === "import" ? "Phiếu nhập hàng" : "Phiếu trả hàng"}
        </h6>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left bg-slate-100 dark:bg-zink-600">
              <tr>
                <th className="p-3">Mã phiếu</th>
                <th className="p-3">
                  Ngày {type === "import" ? "nhập" : "trả"}
                </th>
                <th className="p-3">Số mặt hàng</th>
                <th className="p-3">Thành tiền</th>
                <th className="p-3">Trạng thái phiếu</th>
                <th className="p-3">Trạng thái thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="p-3">
                      <Link
                        to={`/receipt-${type}/update?id=${transaction.id}`}
                        className="text-custom-500"
                      >
                        {transaction.receiptNumber}
                      </Link>
                    </td>
                    <td className="p-3">
                      {getDate(
                        type === "import"
                          ? (transaction as ReceiptImport).importDate
                          : (transaction as ReceiptReturn).returnDate
                      ).format("DD/MM/YYYY")}
                    </td>
                    <td className="p-3">{transaction.totalProduct}</td>
                    <td className="p-3">
                      {formatMoney(transaction.totalAmount)}
                    </td>
                    <td className="p-3">
                      {type === "import" ? (
                        <ReceiptImportStatus item={transaction.status} />
                      ) : (
                        <ReceiptReturnStatus status={transaction.status} />
                      )}
                    </td>
                    <td className="p-3">
                      <PaymentStatusBadge
                        paymentDate={
                          type === "import"
                            ? (transaction as ReceiptImport).paymentDate
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <NoTableResult />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="text-custom-500 btn border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
              onClick={() => onLoadMore(type)}
              disabled={loadingMore}
            >
              {loadingMore ? "Đang tải..." : "Xem thêm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-5">
        <h6 className="text-15 mb-3">Công nợ hiện tại</h6>
        <p className="text-xl font-semibold text-custom-500">
          {formatMoney(totalDebt)} VNĐ
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {renderTransactionTable(receiptImports, "import", hasMoreImports)}
        {renderTransactionTable(receiptReturns, "return", hasMoreReturns)}
      </div>
    </>
  );
};
