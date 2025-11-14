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

export enum InventoryChangeType { 
  IMPORT = "import", // From import receipt 
  RETURN = "return", // From return receipt 
  CHECK = "check", // From inventory check 
  DEBT = "debt", // From debt receipt 
  MANUAL = "manual", // Manual adjustment 
  SYSTEM = "system", // System adjustment 
  ORDER = "order", // From order (negative inventory change) 
}

export interface IInventoryLog {
  id: string;
  changeType: InventoryChangeType;
  previousInventory: number;
  inventoryChange: number;
  currentInventory: number;
  previousCostPrice: number;
  costPriceChange: number;
  currentCostPrice: number;
  referenceId: string;
  user: {
    id: string,
    fullname: string,
  },
  createdAt: string;
}

export interface IInventoryLogsQueryParams {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
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