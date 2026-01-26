import React, { useState } from "react";
import { ChevronDown, ChevronRight, Download } from "lucide-react";
import { formatMoney } from "helpers/utils";
import { getDate } from "helpers/date";
import { ReceiptStatus } from "./ReceiptStatus";
import { Link } from "react-router-dom";
import { Dropdown } from "Common/Components/Dropdown";
import {
  MoreHorizontal,
  Trash2,
  FileEdit,
  Eye,
} from "lucide-react";

interface ReceiptItem {
  receiptId: string;
  id: string;
  code: string;
  productId: string;
  productCode: number;
  productName: string;
  quantity: number;
  inventory: number;
  costPrice: number;
  discount: number;
  createdAt: string;
}

interface Receipt {
  id: string;
  receiptNumber: string;
  note: string | null;
  quantity: number;
  totalProduct: number;
  totalAmount: number;
  supplier: {
    id: string;
    name: string;
  } | null;
  warehouse: any;
  paymentDate: string | null;
  importDate: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string,
    code: string,
    username: string,
    fullname: string,
  };
  items: ReceiptItem[];
}

interface ExpandableReceiptTableProps {
  receipts: Receipt[];
  onClickDelete: (receipt: Receipt) => void;
  onClickShowPrintSingle: (receipt: Receipt) => void;
  onClickShowPrintMultiple: (receipt: Receipt) => void;
  onExportCSV?: () => void;
}

const ExpandableReceiptTable: React.FC<ExpandableReceiptTableProps> = ({
  receipts,
  onClickDelete,
  onClickShowPrintSingle,
  onClickShowPrintMultiple,
  onExportCSV,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (receiptId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(receiptId)) {
      newExpandedRows.delete(receiptId);
    } else {
      newExpandedRows.add(receiptId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="mt-5 overflow-x-auto">
      {/* Export Button */}
      {onExportCSV && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 border border-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      )}

      <div className="border border-slate-200 dark:border-zink-500 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-zink-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-zink-200 uppercase tracking-wider w-10">
                {/* Expand icon column */}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                Mã phiếu
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                Nhà cung cấp
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                Tổng SL
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zink-700 divide-y divide-slate-200 dark:divide-zink-500">
            {receipts.map((receipt, index) => (
              <React.Fragment key={receipt.id}>
                {/* Main Receipt Row */}
                <tr
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-zink-700"
                      : "bg-slate-50 dark:bg-zink-600/50"
                  } hover:bg-slate-100 dark:hover:bg-zink-600 transition-colors cursor-pointer`}
                  onClick={() => toggleRow(receipt.id)}
                >
                  <td className="px-4 py-3">
                    <button
                      className="p-1 hover:bg-slate-200 dark:hover:bg-zink-500 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(receipt.id);
                      }}
                    >
                      {expandedRows.has(receipt.id) ? (
                        <ChevronDown className="w-4 h-4 text-slate-600 dark:text-zink-200" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600 dark:text-zink-200" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/receipt-import/update?id=${receipt.id}`}
                      className="font-medium text-custom-500 hover:text-custom-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {receipt.receiptNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-zink-200">
                    {receipt.supplier?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <ReceiptStatus item={receipt.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-zink-200">
                    <span className="font-semibold">{receipt.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-zink-100">
                    {formatMoney(receipt.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-zink-200">
                    {getDate(receipt.createdAt).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="px-4 py-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Dropdown className="relative dropdown-action-custom">
                        <Dropdown.Trigger
                          id={`dropdownAction${index}`}
                          data-bs-toggle="dropdown"
                          className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20"
                        >
                          <MoreHorizontal className="size-3" />
                        </Dropdown.Trigger>
                      <Dropdown.Content
                        placement="right-end"
                        className="absolute z-[1001] py-2 px-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-lg border border-slate-200 dropdown-menu min-w-[10rem] dark:bg-zink-600 dark:border-zink-500"
                        aria-labelledby={`dropdownAction${index}`}
                      >
                        <li>
                          <a
                            href="#!"
                            className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClickShowPrintSingle(receipt);
                            }}
                          >
                            <Eye className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "}
                            <span className="align-middle">Barcode</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#!"
                            className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClickShowPrintMultiple(receipt);
                            }}
                          >
                            <Eye className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "}
                            <span className="align-middle">In tem mã</span>
                          </a>
                        </li>
                        <li>
                          <Link
                            to={`/receipt-import/update?id=${receipt.id}`}
                            className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileEdit className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "}
                            <span className="align-middle">Cập nhật</span>
                          </Link>
                        </li>
                        <li>
                          <a
                            href="#!"
                            className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClickDelete(receipt);
                            }}
                          >
                            <Trash2 className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "}
                            <span className="align-middle">Xóa</span>
                          </a>
                        </li>
                      </Dropdown.Content>
                    </Dropdown>
                    </div>
                  </td>
                </tr>

                {/* Expanded Items Row */}
                {expandedRows.has(receipt.id) && receipt.items && receipt.items.length > 0 && (
                  <tr className="bg-slate-50 dark:bg-zink-700/50">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="ml-8 border border-slate-200 dark:border-zink-500 rounded-lg overflow-hidden">
                        {/* Items Header */}
                        <div className="bg-slate-200 dark:bg-zink-600 px-4 py-2">
                          <h4 className="text-sm font-semibold text-slate-700 dark:text-zink-100">
                            Chi tiết sản phẩm ({receipt.items.length} sản phẩm)
                          </h4>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-100 dark:bg-zink-600/50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-zink-200">
                                  Mã SP
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-zink-200">
                                  Tên sản phẩm
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-zink-200">
                                  Số lượng
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-zink-200">
                                  Đơn giá
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-zink-200">
                                  Giảm giá
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-zink-200">
                                  Thành tiền
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zink-700 divide-y divide-slate-200 dark:divide-zink-500">
                              {receipt.items.map((item, itemIndex) => {
                                const lineTotal = item.quantity * item.costPrice - item.discount;
                                return (
                                  <tr
                                    key={item.id}
                                    className={`${
                                      itemIndex % 2 === 0
                                        ? "bg-white dark:bg-zink-700"
                                        : "bg-slate-50 dark:bg-zink-600/30"
                                    } hover:bg-slate-100 dark:hover:bg-zink-600/50 transition-colors`}
                                  >
                                    <td className="px-4 py-2 text-sm text-slate-600 dark:text-zink-200">
                                      <span className="font-mono font-medium">
                                        {item.code}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-slate-700 dark:text-zink-100">
                                      {item.productName}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-slate-600 dark:text-zink-200">
                                      <span className="font-semibold">{item.quantity}</span>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-slate-600 dark:text-zink-200">
                                      {formatMoney(item.costPrice)}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-slate-600 dark:text-zink-200">
                                      {item.discount > 0 ? formatMoney(item.discount) : "—"}
                                    </td>
                                    <td className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-zink-100">
                                      {formatMoney(lineTotal)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Summary Section */}
                        <div className="bg-slate-100 dark:bg-zink-600/50 px-4 py-3 border-t border-slate-200 dark:border-zink-500">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-slate-600 dark:text-zink-200">
                              {receipt.note && (
                                <div>
                                  <span className="font-medium">Ghi chú:</span> {receipt.note}
                                </div>
                              )}
                              <div className="mt-1">
                                <span className="font-medium">Người tạo:</span>{" "}
                                <span className="font-mono text-xs">{receipt.user?.fullname || receipt.user?.username}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-600 dark:text-zink-200">
                                Tổng cộng:
                              </div>
                              <div className="text-lg font-bold text-custom-500">
                                {formatMoney(receipt.totalAmount)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandableReceiptTable;
