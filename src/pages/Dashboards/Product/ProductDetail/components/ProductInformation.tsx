import React from "react";
import Barcode from "react-barcode";
import { formatMoney, getS3ImageUrl } from "helpers/utils";
import { ProductStatus } from "../../components/ProductStatus";
import type { IProduct } from "../index.d";

interface ProductInformationProps {
  product: IProduct | null;
}

const ProductInformation: React.FC<ProductInformationProps> = ({ product }) => {
  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Đang tải thông tin sản phẩm...</div>
      </div>
    );
  }

  const renderField = (
    label: string,
    value: string | number | undefined,
    formatter?: (val: any) => string | React.ReactElement
  ) => (
    <div>
      <label className="inline-block mb-2 text-base font-medium">{label}</label>
      <p
        className={`text-base ${!value ? "text-slate-400 dark:text-zink-300 italic" : ""
          }`}
      >
        {value ? (formatter ? formatter(value) : value) : `${label} đang trống`}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-slate-50 dark:bg-zink-600 p-4 rounded-lg">
        <h5 className="text-lg font-medium mb-4">Thông tin cơ bản</h5>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {renderField("Mã sản phẩm", product.code)}
          {renderField("Tên sản phẩm", product.productName)}
          {renderField("Nhóm hàng hóa", product.category)}
          {renderField("Đơn vị tính", product.unit)}
          <div>
            <label className="inline-block mb-2 text-base font-medium">
              Trạng thái
            </label>
            <div>
              <ProductStatus status={product.status} />
            </div>
          </div>
          {renderField("Mô tả", product.description)}
          <div className="xl:col-span-2">
            <label className="inline-block mb-2 text-base font-medium">Ghi chú</label>
            <div className="p-3 bg-white dark:bg-zink-700 border border-slate-200 dark:border-zink-500 rounded-md">
              <p className={`text-base whitespace-pre-wrap ${!product.note ? "text-slate-400 dark:text-zink-300 italic" : "text-slate-600 dark:text-zink-200"
                }`}>
                {product.note || "Chưa có ghi chú"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-slate-50 dark:bg-zink-600 p-4 rounded-lg">
        <h5 className="text-lg font-medium mb-4">Thông tin giá</h5>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {renderField("Giá bán", product.sellingPrice, formatMoney)}
          {renderField("Giá vốn", product.costPrice, formatMoney)}
        </div>
      </div>

      {/* Inventory Information */}
      <div className="bg-slate-50 dark:bg-zink-600 p-4 rounded-lg">
        <h5 className="text-lg font-medium mb-4">Thông tin tồn kho</h5>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div>
            <label className="inline-block mb-2 text-base font-medium">
              Tồn kho hiện tại
            </label>
            <p
              className={`text-base font-semibold ${product.inventory > 0
                  ? product.inventory > 10
                    ? "text-green-600"
                    : "text-orange-600"
                  : "text-red-600"
                }`}
            >
              {product.inventory} {product.unit}
            </p>
          </div>
          {/* {renderField("Tồn kho tối thiểu", product.minStock)}
          {renderField("Tồn kho tối đa", product.maxStock)} */}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-slate-50 dark:bg-zink-600 p-4 rounded-lg">
        <h5 className="text-lg font-medium mb-4">Thông tin bổ sung</h5>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {renderField("Cửa hàng", product.warehouse)}
          {renderField("Mã vạch", product.code, (val) => (
            <Barcode
              value={val}
              format="CODE128"
              width={2}
              height={50}
              // margin={2}
              fontSize={7}
              background="#ffffff"
              lineColor="#000000"
              textAlign="center"
              textPosition="bottom"
            />
          ))}
        </div>
      </div>

      {/* Product Image */}
      <div className="bg-slate-50 dark:bg-zink-600 p-4 rounded-lg">
        <h5 className="text-lg font-medium mb-4">Hình ảnh sản phẩm</h5>
        <div className="flex justify-start">
          {product.imageUrls && product.imageUrls.map((url, index) => (
            <img
              src={url}
              alt={product.productName}
              key={index}
              className="max-w-xs max-h-64 object-contain rounded-lg border border-slate-200 dark:border-zink-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ))}

          {product.images && product.images.map((image) => (
            <img
              src={getS3ImageUrl(image.path)}
              alt={product.productName}
              key={image.id}
              className="max-w-xs max-h-64 object-contain rounded-lg border border-slate-200 dark:border-zink-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductInformation;
