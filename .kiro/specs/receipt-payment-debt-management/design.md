# Design Document

## Overview

The ReceiptPayment Management feature is designed as a comprehensive expense transaction management system within the AIOM Dashboard. The system follows the established patterns of the existing dashboard while providing specialized functionality for managing expense payments to suppliers and other business expenses.

The design leverages the existing component architecture, including the TableCustom component, navigation patterns, and Ant Design components to ensure consistency with the current application. The feature will be implemented as a new page under the Sales Management section with a tabbed interface for separating income and expense management.

## Architecture

### Component Hierarchy

```
ReceiptPaymentManagement (Page Component)
├── Breadcrumb (Navigation)
├── ReceiptPaymentSummaryCards (Statistics)
├── ReceiptPaymentFilters (Search & Filter)
├── ReceiptPaymentTable (Transaction List)
├── TransactionDetailModal (Shared)
└── CreateTransactionModal (Shared)
```

### Data Flow Architecture

```
User Interaction → Component State → API Service → Backend
                ↓
Component Updates ← State Management ← API Response
```

### State Management Strategy

The feature will use local component state for UI interactions and filters, with Redux integration for:
- Transaction data caching
- User preferences (tab selection, filter settings)
- Loading states and error handling

## Components and Interfaces

### Core Page Component

**ReceiptPaymentManagement.tsx**
```typescript
interface ReceiptPaymentManagementProps {}

interface ReceiptPaymentState {
  loading: boolean;
  error: string | null;
  transactions: ReceiptPayment[];
}
```

### Main Component

**ReceiptPaymentManagement.tsx**
```typescript
interface ReceiptPaymentProps {
  transactions: ReceiptPayment[];
  loading: boolean;
  onRefresh: () => void;
  onCreateTransaction: () => void;
  onExportData: () => void;
}

interface ReceiptPaymentState {
  filteredTransactions: ReceiptPayment[];
  searchText: string;
  dateRange: [Dayjs, Dayjs] | null;
  statusFilter: ReceiptPaymentStatus | null;
  expenseTypeFilter: ReceiptPaymentExpenseType | null;
}
```

### Summary Cards Component

**SummaryCards.tsx**
```typescript
interface SummaryCardsProps {
  transactions: ReceiptPayment[];
}

interface SummaryData {
  total: number;
  outstanding: number;
  overdue: {
    amount: number;
    count: number;
  };
  settledInPeriod: number;
}
```

### Transaction Table Component

**TransactionTable.tsx**
```typescript
interface TransactionTableProps {
  transactions: ReceiptPayment[];
  loading: boolean;
  onTransactionClick: (transaction: ReceiptPayment) => void;
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
}
```

## Data Models

### ReceiptPayment Interface

```typescript
interface ReceiptPayment {
  id: string;
  code: string; // PC-DDMMYY-XXXX
  paymentDate: string;
  expenseType: ReceiptPaymentExpenseType;
  expenseTypeName?: string; // For "OTHER" type to store custom name
  paymentObject?: string; // Name of the payment object
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  attachments: Attachment[];
  status: ReceiptPaymentStatus;
  // References
  supplierId?: string;
  receiptImportId?: string; // Reference to receipt import if this is a supplier payment
  userId: string;
  createdAt: string;
  updatedAt: string;
}

enum ReceiptPaymentExpenseType {
  SUPPLIER_PAYMENT = "supplier_payment",
  TRANSPORTATION = "transportation", 
  UTILITIES = "utilities",
  RENT = "rent",
  LABOR = "labor",
  OTHER = "other",
}

enum ReceiptPaymentStatus {
  DRAFT = "draft",
  PAID = "paid", 
  DEBT_PAYMENT = "debt_payment",
  CANCELLED = "cancelled"
}

enum PaymentMethod {
  CASH = 1,
  TRANSFER = 2
}

interface Attachment {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  uploadedAt: string;
}
```

### Filter State Interface

```typescript
interface FilterState {
  searchText: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  status: ReceiptPaymentStatus | null;
  expenseType: ReceiptPaymentExpenseType | null;
  paymentObject: string | null;
  supplierId: string | null;
  amountRange: {
    min: number | null;
    max: number | null;
  };
}
```

## User Interface Design

### Layout Structure

The page will follow the established dashboard layout pattern:

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb Navigation                                   │
├─────────────────────────────────────────────────────────┤
│ Page Title: "Quản lý Chi"                              │
├─────────────────────────────────────────────────────────┤
│ Summary Cards Row                                       │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ Tổng Chi│ │ Đã Thanh│ │ Công Nợ │ │ Nháp    │        │
│ │         │ │ Toán    │ │ Chi     │ │         │        │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
├─────────────────────────────────────────────────────────┤
│ Filter & Action Bar                                     │
│ [Search] [Date Range] [Status] [Type] [Export] [Create] │
├─────────────────────────────────────────────────────────┤
│ Transaction Table                                       │
│ ┌─────┬──────┬──────┬──────┬──────┬──────┬──────┐      │
│ │ Mã  │ Ngày │ Loại │ Đối  │ Số   │ Trạng│ Hành │      │
│ │     │      │      │ tượng│ tiền │ thái │ động │      │
│ └─────┴──────┴──────┴──────┴──────┴──────┴──────┘      │
└─────────────────────────────────────────────────────────┘
```

### Summary Cards Design

Each summary card will display:
- Icon representing the metric
- Large number value with proper formatting
- Descriptive label
- Color coding (green for positive, red for overdue, blue for neutral)
- Trend indicators where applicable

### Table Column Configuration

**ReceiptPayment (Expense) Table Columns:**
1. Mã phiếu (Transaction Code) - Sortable, Searchable
2. Ngày chi (Payment Date) - Sortable, Date filter
3. Loại chi phí (Expense Type) - Filterable
4. Đối tượng chi (Payment Object) - Searchable, Filterable
5. Số tiền (Amount) - Sortable, Currency format
6. Phương thức (Payment Method) - Filterable
7. Trạng thái (Status) - Filterable, Tag display
8. Hành động (Actions) - Dropdown menu

### Filter Panel Design

The filter panel will include:
- Search input with debounced search
- Date range picker with quick select options
- Status dropdown with multi-select
- Transaction type dropdown
- Amount range inputs
- Clear all filters button

### Action Buttons

- **Create Transaction**: Primary button, opens creation modal
- **Export Excel**: Secondary button, exports filtered data
- **Refresh**: Icon button, reloads data
- **Column Settings**: Icon button, toggles column visibility

## Error Handling

### Error Boundary Implementation

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ReceiptPaymentErrorBoundary extends Component<Props, ErrorBoundaryState> {
  // Error boundary implementation for the entire feature
}
```

### API Error Handling

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

const handleApiError = (error: ApiError) => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      message.error('Lỗi kết nối mạng. Vui lòng thử lại.');
      break;
    case 'UNAUTHORIZED':
      message.error('Phiên đăng nhập đã hết hạn.');
      // Redirect to login
      break;
    case 'VALIDATION_ERROR':
      message.error('Dữ liệu không hợp lệ.');
      break;
    default:
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
  }
};
```

### Loading States

- **Initial Load**: Full page skeleton
- **Filter Changes**: Table loading overlay
- **Actions**: Button loading states
- **Export**: Progress indicator

### Empty States

- **No Data**: Illustration with call-to-action
- **No Search Results**: Clear filters suggestion
- **No Overdue Items**: Positive message

## Testing Strategy

### Unit Testing

**Component Tests:**
- Render tests for all components
- Props validation and default values
- Event handler functionality
- State management logic

**Utility Function Tests:**
- Currency formatting
- Date calculations
- Filter logic
- Export functionality

### Integration Testing

**Page Level Tests:**
- Tab switching functionality
- Filter interactions
- Table sorting and pagination
- API integration points

**User Flow Tests:**
- Complete transaction management workflow
- Search and filter combinations
- Export functionality
- Error handling scenarios

### Accessibility Testing

**WCAG Compliance:**
- Keyboard navigation support
- Screen reader compatibility
- Color contrast validation
- Focus management

**Testing Tools:**
- Jest + React Testing Library for unit tests
- Cypress for E2E testing
- axe-core for accessibility testing

### Performance Testing

**Metrics to Monitor:**
- Initial page load time
- Table rendering performance with large datasets
- Filter response time
- Export generation time

**Optimization Strategies:**
- Virtual scrolling for large tables
- Debounced search inputs
- Memoized calculations
- Lazy loading for non-critical components

## Navigation Integration

### Sidebar Menu Update

The sidebar menu will be updated to include the new ReceiptPayment Management item:

```typescript
// Add to menuItems in MainLayout.tsx
{
  key: 'sales',
  icon: <SettingOutlined />,
  label: 'Quản lý bán hàng',
  children: [
    {
      key: '/customers',
      label: 'Khách hàng',
    },
    {
      key: '/suppliers',
      label: 'Nhà cung cấp',
    },
    {
      key: '/receipt-payment-management', // New menu item
      label: 'Quản lý Chi',
    },
  ],
}
```

### Routing Configuration

```typescript
// Add to routing configuration
{
  path: '/receipt-payment-management',
  element: <ReceiptPaymentManagement />,
}
```

### Breadcrumb Configuration

```typescript
const breadcrumbConfig = {
  '/receipt-payment-management': {
    title: 'Quản lý Chi',
    parent: '/sales',
  },
};
```

## Responsive Design

### Breakpoint Strategy

- **Desktop (≥1200px)**: Full layout with all columns visible
- **Tablet (768px-1199px)**: Condensed layout, some columns hidden
- **Mobile (≤767px)**: Card-based layout, drawer filters

### Mobile Adaptations

- Summary cards stack vertically
- Table becomes horizontally scrollable
- Filters move to collapsible drawer
- Action buttons become floating action button
- Simplified column set for mobile view

## Performance Considerations

### Data Management

- **Pagination**: Server-side pagination for large datasets
- **Caching**: Redux-based caching with TTL
- **Debouncing**: Search inputs debounced at 300ms
- **Virtual Scrolling**: For tables with >1000 rows

### Bundle Optimization

- **Code Splitting**: Lazy load the entire feature
- **Tree Shaking**: Import only used Ant Design components
- **Asset Optimization**: Compress images and icons

### Memory Management

- **Cleanup**: useEffect cleanup for subscriptions
- **Memoization**: React.memo for expensive components
- **State Optimization**: Minimize re-renders with proper state structure