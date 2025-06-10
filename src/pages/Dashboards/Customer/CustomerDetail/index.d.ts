import { CUSTOMER_STATUS, CUSTOMER_GROUP } from "Common/constants/customer-constant";

export interface ICustomer {
  id: string;
  customerCode: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  taxCode: string;
  address: string;
  note: string;
  totalDebt: number;
  status?: CUSTOMER_STATUS | null;
  type?: CUSTOMER_GROUP | null;
}

export interface ISalesOrder {
  id: string;
  orderCode: string;
  createdAt: string;
  transactionType: "sale" | "return";
  quantity: number;
  totalAmount: number;
  status: string;
}

export interface IDebtRecord {
  id: string;
  date: string;
  orderCode: string;
  description: string;
  amount: number;
  amountPaid: number;
  remainingBalance: number;
  notes: string;
}
