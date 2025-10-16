import { 
  ReceiptPayment, 
  ReceiptDebt, 
  ReceiptCollection,
  ReceiptPaymentExpenseType, 
  ReceiptPaymentStatus,
  ReceiptCollectionStatus,
  ReceiptDebtStatus,
  ReceiptDebtType,
  PaymentMethod 
} from "types/receiptPayment";

// Mock data for testing
export const mockReceiptPayments: ReceiptPayment[] = [
  {
    id: "1",
    code: "PC070825",
    paymentDate: "2025-08-07",
    expenseType: ReceiptPaymentExpenseType.SUPPLIER_PAYMENT,
    paymentObject: "Cty ABC",
    amount: 5000000,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: "Chi tiền hàng tháng 8",
    attachments: [],
    status: ReceiptPaymentStatus.PAID,
    supplier: {
      id: "sup1",
      name: "Cty ABC",
      code: "ABC001"
    },
    userId: "user1",
    createdAt: "2025-08-07T10:00:00Z",
    updatedAt: "2025-08-07T10:00:00Z"
  },
  {
    id: "2",
    code: "PC080825",
    paymentDate: "2025-08-08",
    expenseType: ReceiptPaymentExpenseType.TRANSPORTATION,
    paymentObject: "Vận chuyển hàng",
    amount: 500000,
    paymentMethod: PaymentMethod.CASH,
    notes: "Chi phí vận chuyển",
    attachments: [],
    status: ReceiptPaymentStatus.DEBT_PAYMENT,
    userId: "user1",
    createdAt: "2025-08-08T10:00:00Z",
    updatedAt: "2025-08-08T10:00:00Z"
  },
  {
    id: "3",
    code: "PC090825",
    paymentDate: "2025-08-09",
    expenseType: ReceiptPaymentExpenseType.UTILITIES,
    paymentObject: "Tiền điện",
    amount: 2000000,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: "Tiền điện tháng 8",
    attachments: [],
    status: ReceiptPaymentStatus.PAID,
    userId: "user1",
    createdAt: "2025-08-09T10:00:00Z",
    updatedAt: "2025-08-09T10:00:00Z"
  }
];

export const mockReceiptDebts: ReceiptDebt[] = [
  {
    id: "1",
    code: "PT25091108437DLO",
    createdAt: "2025-09-11 08:43:14.13387",
    customerName: "Shopee",
    supplierName: null,
    dueDate: "2025-09-12 15:37:00",
    note: "",
    paidAmount: 0,
    paymentDate: null,
    remainingAmount: 20000,
    status: ReceiptDebtStatus.PENDING,
    totalAmount: 20000,
    type: ReceiptDebtType.CUSTOMER_DEBT
  },
  {
    id: "2",
    code: "PT25091108438ABC",
    createdAt: "2025-09-10 10:30:00.00000",
    customerName: null,
    supplierName: "Công ty ABC",
    dueDate: "2025-09-15 12:00:00",
    note: "Nợ nhà cung cấp hàng tháng 9",
    paidAmount: 5000000,
    paymentDate: "2025-09-12 14:30:00",
    remainingAmount: 10000000,
    status: ReceiptDebtStatus.PARTIAL_PAID,
    totalAmount: 15000000,
    type: ReceiptDebtType.SUPPLIER_DEBT
  },
  {
    id: "3",
    code: "PT25091108439XYZ",
    createdAt: "2025-09-05 09:15:00.00000",
    customerName: "Lazada",
    supplierName: null,
    dueDate: "2025-09-08 16:00:00",
    note: "Quá hạn thanh toán",
    paidAmount: 2000000,
    paymentDate: null,
    remainingAmount: 8000000,
    status: ReceiptDebtStatus.OVERDUE,
    totalAmount: 10000000,
    type: ReceiptDebtType.CUSTOMER_DEBT
  }
];

// Mock data for Unpaid Receipts (for supplier payment selection)
export interface UnpaidReceipt {
  id: string;
  code: string;
  supplier: {
    id: string;
    name: string;
  };
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  createdAt: string;
}

export const mockUnpaidReceipts: UnpaidReceipt[] = [
  {
    id: "receipt1",
    code: "PN001",
    supplier: {
      id: "sup1",
      name: "Công ty ABC"
    },
    totalAmount: 10000000,
    paidAmount: 3000000,
    remainingAmount: 7000000,
    dueDate: "2025-07-15",
    createdAt: "2025-06-01T10:00:00Z"
  },
  {
    id: "receipt2",
    code: "PN002",
    supplier: {
      id: "sup2",
      name: "Công ty XYZ"
    },
    totalAmount: 5000000,
    paidAmount: 0,
    remainingAmount: 5000000,
    dueDate: "2025-07-20",
    createdAt: "2025-06-05T10:00:00Z"
  },
  {
    id: "receipt3",
    code: "PN003",
    supplier: {
      id: "sup1",
      name: "Công ty ABC"
    },
    totalAmount: 8000000,
    paidAmount: 2000000,
    remainingAmount: 6000000,
    dueDate: "2025-07-25",
    createdAt: "2025-06-10T10:00:00Z"
  }
];

// Mock data for Receipt Collections (Phiếu Thu)
export const mockReceiptCollections: ReceiptCollection[] = [
  {
    id: "1",
    code: "PT0001",
    expectedCollectionDate: "2025-06-28",
    customer: {
      id: "cust1",
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "nguyenvana@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM"
    },
    status: ReceiptCollectionStatus.DEBT,
    totalDebt: 10000000,
    paidAmount: 2000000,
    remainingAmount: 8000000,
    notes: "Công nợ từ đơn hàng tháng 5",
    createdAt: "2025-05-15T10:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
    userId: "user1"
  },
  {
    id: "2",
    code: "PT0002",
    expectedCollectionDate: "2025-07-15",
    customer: {
      id: "cust2",
      name: "Trần Thị B",
      phone: "0907654321",
      email: "tranthib@email.com"
    },
    status: ReceiptCollectionStatus.PARTIAL_PAID,
    totalDebt: 5000000,
    paidAmount: 3000000,
    remainingAmount: 2000000,
    notes: "Đã thanh toán 1 phần",
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-06-20T10:00:00Z",
    userId: "user1"
  },
  {
    id: "3",
    code: "PT0003",
    expectedCollectionDate: "2025-06-01",
    customer: {
      id: "cust3",
      name: "Lê Văn C",
      phone: "0903456789",
      email: "levanc@email.com"
    },
    status: ReceiptCollectionStatus.OVERDUE,
    totalDebt: 7500000,
    paidAmount: 1000000,
    remainingAmount: 6500000,
    notes: "Quá hạn thanh toán",
    createdAt: "2025-05-01T10:00:00Z",
    updatedAt: "2025-06-05T10:00:00Z",
    userId: "user1"
  },
  {
    id: "4",
    code: "PT0004",
    expectedCollectionDate: "2025-07-30",
    customer: {
      id: "cust4",
      name: "Phạm Thị D",
      phone: "0909876543",
      email: "phamthid@email.com"
    },
    status: ReceiptCollectionStatus.COMPLETED,
    totalDebt: 3000000,
    paidAmount: 3000000,
    remainingAmount: 0,
    notes: "Đã hoàn thành thanh toán",
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2025-07-25T10:00:00Z",
    userId: "user1"
  }
];

export const mockPagination = {
  page: 1,
  limit: 10,
  totalItems: 3,
  totalPages: 1
};