import React from "react";
import { formatMoney } from "helpers/utils";
import { NoTableResult } from "Common/Components/NoTableResult";
import type { IProductSupplier } from "../index.d";
import { SUPPLIER_STATUS } from "Common/constants/supplier-constant";

interface SupplierInfoProps {
  suppliers: IProductSupplier[];
}

const SupplierInfo: React.FC<SupplierInfoProps> = ({ suppliers }) => {
  const getStatusBadge = (status?: string) => {
    const baseClasses =
      "px-2.5 py-0.5 inline-block text-xs font-medium rounded border";

    switch (status) {
      case SUPPLIER_STATUS.COLLABORATING:
        return `${baseClasses} bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent`;
      case SUPPLIER_STATUS.PAUSED:
        return `${baseClasses} bg-orange-100 border-transparent text-orange-500 dark:bg-orange-500/20 dark:border-transparent`;
      case SUPPLIER_STATUS.STOPPED_COLLABORATING:
        return `${baseClasses} bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent`;
      default:
        return `${baseClasses} bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20 dark:text-zink-200`;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case SUPPLIER_STATUS.COLLABORATING:
        return "Đang hợp tác";
      case SUPPLIER_STATUS.PAUSED:
        return "Tạm dừng";
      case SUPPLIER_STATUS.STOPPED_COLLABORATING:
        return "Ngừng hợp tác";
      default:
        return status || "Không xác định";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h5 className="text-lg font-medium">Thông tin nhà cung cấp</h5>
        <span className="text-sm text-slate-500">
          {suppliers.length} nhà cung cấp
        </span>
      </div>

      {suppliers.length > 0 ? (
        <div className="grid gap-4">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-slate-50 dark:bg-zink-600 p-4 rounded-lg"
            >
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div>
                  <h6 className="text-base font-medium mb-3">
                    {supplier.name}
                  </h6>
                  <div className="space-y-2">
                    {supplier.company && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Công ty:{" "}
                        </span>
                        <span className="text-sm">{supplier.company}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Điện thoại:{" "}
                        </span>
                        <span className="text-sm">{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.email && (
                      <div>
                        <span className="text-sm text-slate-500">Email: </span>
                        <span className="text-sm">{supplier.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-2">
                    {supplier.costPrice && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Giá vốn:{" "}
                        </span>
                        <span className="text-sm font-medium">
                          {formatMoney(supplier.costPrice)}
                        </span>
                      </div>
                    )}
                    {/* {supplier.leadTime && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Thời gian giao hàng:{" "}
                        </span>
                        <span className="text-sm">
                          {supplier.leadTime} ngày
                        </span>
                      </div>
                    )}
                    {supplier.minOrderQuantity && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Số lượng đặt tối thiểu:{" "}
                        </span>
                        <span className="text-sm">
                          {supplier.minOrderQuantity}
                        </span>
                      </div>
                    )} */}
                    {supplier.status && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Trạng thái:{" "}
                        </span>
                        <span className={getStatusBadge(supplier.status)}>
                          {getStatusLabel(supplier.status)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-zink-600 p-8 rounded-lg">
          <NoTableResult />
        </div>
      )}
    </div>
  );
};

export default SupplierInfo;
