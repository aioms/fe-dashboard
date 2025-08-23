import { PRODUCT_STATUS } from "Common/constants/product-constant";

export interface IProduct {
  id: string;
  code: string;
  productCode?: string;
  productName: string;
  category: string;
  unit: string;
  sellingPrice: number;
  costPrice: number;
  inventory: number;
  description?: string;
  note?: string;
  warehouse?: string;
  status: PRODUCT_STATUS;
  suppliers?: IProductSupplier[];
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  imageUrls?: string[];
}

export interface IInventoryRecord {
  id: string;
  date: string;
  type: "import" | "export" | "adjustment";
  quantity: number;
  reason: string;
  reference?: string;
  remainingStock: number;
  note?: string;
}

export interface IProductSupplier {
  id: string;
  code: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  costPrice?: number;
  address?: string;
  status?: string;
}