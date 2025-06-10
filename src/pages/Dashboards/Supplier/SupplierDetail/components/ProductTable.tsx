import React from "react";
import { formatMoney } from "helpers/utils";
import { NoTableResult } from "Common/Components/NoTableResult";

export interface Product {
  id: string;
  code: string;
  productCode: number;
  productName: string;
  costPrice: number;
  inventory: number;
}

interface ProductTableProps {
  products: Product[];
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onLoadMore,
  hasMore,
  loadingMore
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="text-left bg-slate-100 dark:bg-zink-600">
          <tr>
            <th className="p-3">Mã sản phẩm</th>
            <th className="p-3">Tên sản phẩm</th>
            <th className="p-3">Giá vốn</th>
            <th className="p-3">Tồn kho hiện tại</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td className="p-3">{product.code}</td>
                <td className="p-3">{product.productName}</td>
                <td className="p-3">{formatMoney(product.costPrice)}</td>
                <td className="p-3">{product.inventory}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                <NoTableResult />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="text-custom-500 btn border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};