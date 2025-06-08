import React, { useLayoutEffect, useState } from "react";
import Modal from "Common/Components/Modal";
import { Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import TableContainer from "Common/TableContainer";
import { request } from "helpers/axios";
import { formatMoney } from "helpers/utils";
import { IHttpResponse } from "types";

interface props {
  show: boolean;
  file: any;
  onCancel: () => void;
  onDone?: () => void;
}

interface ExcelData {
  [key: string]: string | number;
}

// Add date formatting function
const formatDateTime = (value: any) => {
  if (!value) return "";

  // Handle Excel date serial numbers
  if (typeof value === "number" && value > 25569) {
    const date = new Date((value - 25569) * 86400 * 1000);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Handle string dates
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return value;
};

// Add status formatting function
const formatStatus = (value: any) => {
  if (value === 1 || value === "1") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
        Hoạt động
      </span>
    );
  } else if (value === 0 || value === "0") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
        Không hoạt động
      </span>
    );
  }
  return value;
};

const ImportCustomerModal: React.FC<props> = ({
  show,
  file,
  onCancel,
  onDone,
}) => {
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [importType, setImportType] = useState("1");

  const columns = React.useMemo<ColumnDef<ExcelData>[]>(() => {
    if (excelData.length === 0) return [];

    return Object.keys(excelData[0]).map((key) => ({
      header: key,
      accessorKey: key,
      enableColumnFilter: false,
      enableSorting: false,
      cell: (cell: any) => {
        const value = cell.getValue();

        // Money columns
        const columnsMoneyTypes = [
          "Nợ cần thu hiện tại",
          "Tổng bán",
          "Tổng bán trừ trả hàng",
        ];

        // Date/DateTime columns
        const columnsDateTypes = ["Ngày tạo", "Ngày giao dịch cuối"];

        // Status columns
        const columnsStatusTypes = ["Trạng thái", "Status", "Hoạt động"];

        if (columnsMoneyTypes.includes(key.trim())) {
          return formatMoney(value);
        }

        if (columnsDateTypes.includes(key.trim())) {
          return formatDateTime(value);
        }

        if (columnsStatusTypes.includes(key)) {
          return formatStatus(value);
        }

        return value;
      },
    }));
  }, [excelData]);

  const handleImport = async () => {
    setButtonLoading(true);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response: IHttpResponse = await request.post(
        `/customers/import?type=${importType}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!response.success) {
        throw new Error("Có lỗi xảy ra khi nhập file excel!");
      }

      toast.success("Nhập file excel thành công!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setButtonLoading(false);
      setLoading(false);
      handleClose();
      onDone?.();
    }
  };

  const onRadioImportTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setImportType(value);
  };

  const handleClose = () => {
    setExcelData([]);
    onCancel();
  };

  useLayoutEffect(() => {
    const loadExcelData = async () => {
      try {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          setExcelData(jsonData as ExcelData[]);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error reading Excel file:", error);
        toast.error("Lỗi khi đọc file Excel");
      } finally {
        setLoading(false);
      }
    };

    if (file && show) {
      loadExcelData();
    }
  }, [file, show]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      modal-center="true"
      className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
      dialogClassName="w-screen lg:w-[75rem] xl:w-[85rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full"
    >
      <Modal.Header
        className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
        closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
      >
        <Modal.Title className="text-16">Nhập dữ liệu khách hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
        <div className="mb-3">
          <p className="mb-2 text-slate-500 dark:text-zink-200">
            Chọn loại nhập dữ liệu:
          </p>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="importType"
                value="1"
                checked={importType === "1"}
                onChange={onRadioImportTypeChange}
              />
              <span className="ml-2">Thêm mới</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="importType"
                value="2"
                checked={importType === "2"}
                onChange={onRadioImportTypeChange}
              />
              <span className="ml-2">Cập nhật</span>
            </label>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Đang xử lý file...</span>
          </div>
        ) : (
          excelData.length > 0 && (
            <div className="overflow-auto">
              <TableContainer
                isPagination={true}
                columns={columns}
                data={excelData}
                customPageSize={20}
                divclassName="overflow-x-auto"
                tableclassName="w-full whitespace-nowrap"
                theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
                thclassName="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500"
                tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
                PaginationClassName="flex justify-end mt-4"
              />
            </div>
          )
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="text-red-500 bg-white border-white btn hover:text-red-600 focus:text-red-600 active:text-red-600 dark:bg-zink-500 dark:border-zink-500"
            onClick={handleClose}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
            onClick={handleImport}
            disabled={isButtonLoading || excelData.length === 0}
          >
            {isButtonLoading && (
              <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
            )}
            Nhập dữ liệu
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImportCustomerModal;
