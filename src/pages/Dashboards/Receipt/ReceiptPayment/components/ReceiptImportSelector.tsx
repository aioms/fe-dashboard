import { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import { UnpaidReceiptImport } from "types/receiptPayment";
import { formatDateTime } from "helpers/utils";

interface ReceiptImportSelectorProps {
  receipts: UnpaidReceiptImport[];
  selectedReceiptIds: string[];
  onSelectionChange: (receiptIds: string[]) => void;
  loading?: boolean;
}

export const ReceiptImportSelector: React.FC<ReceiptImportSelectorProps> = ({
  receipts,
  selectedReceiptIds,
  onSelectionChange,
  loading = false,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredReceipts = useMemo(() => {
    if (!searchKeyword.trim()) {
      return receipts;
    }

    const keyword = searchKeyword.toLowerCase();
    return receipts.filter((receipt) => {
      return (
        receipt.receiptNumber.toLowerCase().includes(keyword) ||
        receipt.supplier.name.toLowerCase().includes(keyword) ||
        receipt.note?.toLowerCase().includes(keyword)
      );
    });
  }, [receipts, searchKeyword]);

  const handleToggleReceipt = (receiptId: string) => {
    if (selectedReceiptIds.includes(receiptId)) {
      onSelectionChange(selectedReceiptIds.filter((id) => id !== receiptId));
    } else {
      onSelectionChange([...selectedReceiptIds, receiptId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedReceiptIds.length === filteredReceipts.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredReceipts.map((r) => r.id));
    }
  };

  const isAllSelected =
    filteredReceipts.length > 0 &&
    selectedReceiptIds.length === filteredReceipts.length;

  return (
    <div>
      <label className="inline-block mb-2 text-base font-medium">
        Chọn phiếu nhập chưa thanh toán <span className="text-red-500">*</span>
      </label>

      {/* Search Box */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          className="form-input pl-10 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
          placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp, ghi chú..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      {/* Receipt List */}
      <div className="border border-slate-200 dark:border-zink-500 rounded-md max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-slate-500">
            <div className="inline-block size-6 border-2 border-slate-300 border-t-custom-500 rounded-full animate-spin"></div>
            <p className="mt-2">Đang tải danh sách phiếu nhập...</p>
          </div>
        ) : filteredReceipts.length === 0 ? (
          <div className="p-4 text-center text-slate-500">
            {receipts.length === 0
              ? "Không có phiếu nhập chưa thanh toán"
              : "Không tìm thấy kết quả phù hợp"}
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="sticky top-0 bg-slate-50 dark:bg-zink-600 border-b border-slate-200 dark:border-zink-500 p-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="size-4 border rounded border-slate-200 dark:border-zink-500 text-custom-500 focus:ring focus:ring-custom-100 dark:focus:ring-custom-500/20"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                <span className="ml-2 text-sm font-medium text-slate-700 dark:text-zink-100">
                  Chọn tất cả ({filteredReceipts.length})
                </span>
              </label>
            </div>

            {/* Receipt Items */}
            {filteredReceipts.map((receipt) => {
              const isSelected = selectedReceiptIds.includes(receipt.id);
              return (
                <div
                  key={receipt.id}
                  className={`p-3 border-b border-slate-200 dark:border-zink-500 last:border-b-0 hover:bg-slate-50 dark:hover:bg-zink-600 cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50 dark:bg-blue-500/10" : ""
                  }`}
                  onClick={() => handleToggleReceipt(receipt.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-6">
                      <input
                        type="checkbox"
                        className="size-4 border rounded border-slate-200 dark:border-zink-500 text-custom-500 focus:ring focus:ring-custom-100 dark:focus:ring-custom-500/20"
                        checked={isSelected}
                        onChange={() => handleToggleReceipt(receipt.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-sm font-semibold text-slate-700 dark:text-zink-100">
                          {receipt.receiptNumber}
                        </h5>
                        {isSelected && (
                          <Check className="size-4 text-custom-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-zink-300 mb-1">
                        <span className="font-medium">NCC:</span>{" "}
                        {receipt.supplier.name}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zink-400">
                        <span>
                          <span className="font-medium">Tổng tiền:</span>{" "}
                          {receipt.totalAmount.toLocaleString("vi-VN")}₫
                        </span>
                        <span>
                          <span className="font-medium">Kho:</span>{" "}
                          {receipt.warehouse || "-"}
                        </span>
                      </div>
                      {receipt.note && (
                        <p className="text-xs text-slate-500 dark:text-zink-400 mt-1">
                          <span className="font-medium">Ghi chú:</span>{" "}
                          {receipt.note}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zink-400 mt-1">
                        <span>
                          <span className="font-medium">Ngày nhập:</span>{" "}
                          {receipt.importDate
                            ? formatDateTime(
                                receipt.importDate,
                                true,
                                "DD/MM/YYYY"
                              )
                            : "-"}
                        </span>
                        <span>
                          <span className="font-medium">Hạn TT:</span>{" "}
                          {receipt.paymentDate
                            ? formatDateTime(
                                receipt.paymentDate,
                                true,
                                "DD/MM/YYYY"
                              )
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Selection Summary */}
      {selectedReceiptIds.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-md border border-blue-200 dark:border-blue-500/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">Đã chọn:</span>{" "}
            {selectedReceiptIds.length} phiếu nhập
          </p>
        </div>
      )}
    </div>
  );
};
