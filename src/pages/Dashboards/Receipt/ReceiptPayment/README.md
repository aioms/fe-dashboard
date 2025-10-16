# Receipt Payment Management System

This module implements a comprehensive receipt payment management system with separate tabs for receipt payments and receipt debts.

## Features Implemented

### ✅ Core Functionality
- **Two-tab interface**: Receipt Payment List and Receipt Debt List
- **Independent filtering**: Each tab has its own filter controls
- **Pagination**: Both lists support pagination
- **Search functionality**: Keyword search across multiple fields
- **CRUD operations**: Create, read, update, delete receipt payments
- **Error handling**: Proper error states and user feedback
- **Empty states**: Clear messaging when no records are found

### ✅ Receipt Payment List
- Display all receipt payments with status filtering
- Columns: Code, Payment Date, Expense Type, Payment Object, Amount, Status, Notes, Actions
- Summary cards showing total payments and total debt
- Status badges with color coding
- Expense type badges with categorization

### ✅ Receipt Debt List  
- Display only debt payments with additional debt-specific information
- Columns: Code, Payment Date, Expense Type, Payment Object, Total Debt, Paid Amount, Remaining Amount, Due Date, Actions
- Overdue debt highlighting with warning icons
- Summary cards showing debt statistics
- Due date filtering and overdue indicators
- Detailed view for individual debt records

### ✅ Receipt Debt Detail
- Comprehensive debt information display
- Financial breakdown with total, paid, and remaining amounts
- Status tracking with visual progress indicators
- Overdue warnings and alerts
- Payment history timeline
- Quick actions for common operations (add payment, send reminder, print)
- Customer/Supplier information display
- Notes and remarks section

### ✅ Filtering System
- **Date range filtering**: Start date and end date
- **Expense type filtering**: All expense types with Vietnamese labels
- **Status filtering**: Draft, Paid, Debt Payment, Cancelled
- **Keyword search**: Search by code, payment object, supplier name
- **Debt-specific filters**: Due date ranges, overdue status

### ✅ Component Architecture
- **Feature-based organization**: Following project structure guidelines
- **Reusable components**: Filters, badges, status indicators
- **TypeScript interfaces**: Comprehensive type definitions
- **Redux integration**: State management with thunks
- **Mock data**: Sample data for testing and development

## File Structure

```
src/pages/Dashboards/Receipt/ReceiptPayment/
├── ReceiptPaymentManagement.tsx    # Main page with tabs
├── ReceiptPaymentCreate.tsx        # Create new payment form
├── ReceiptPaymentDetail.tsx        # Payment detail view
├── ReceiptDebtDetail.tsx           # Debt detail view (NEW)
├── mockData.ts                     # Mock data for testing
├── components/
│   ├── ReceiptPaymentList.tsx      # Payment list component
│   ├── ReceiptDebtList.tsx         # Debt list component
│   ├── ReceiptPaymentFilters.tsx   # Payment filters
│   ├── ReceiptDebtFilters.tsx      # Debt filters
│   ├── PaymentStatusBadge.tsx      # Status badge component
│   └── ExpenseTypeBadge.tsx        # Expense type badge component
└── index.ts                        # Barrel exports

src/slices/receipt-payment/
├── reducer.ts                      # Redux slice
└── thunk.ts                        # Async actions

src/apis/receipt/
└── receiptPayment.ts              # API functions

src/types/
└── receiptPayment.ts              # TypeScript interfaces
```

## Usage

### Navigation
Access the receipt payment management system at `/receipt-payment`

### Viewing Debt Details
- Navigate to the debt detail page from the debt list
- URL pattern: `/receipt-debt/detail/:id`
- View comprehensive debt information including:
  - Basic information (code, due date, customer/supplier)
  - Financial breakdown (total, paid, remaining)
  - Status and progress indicators
  - Payment history
  - Notes and remarks

### Creating New Payments
- Click "Tạo phiếu chi" button to create new payments
- Form includes all required fields with validation
- Supports different expense types and payment methods

### Filtering and Search
- Use the search bar for keyword searches
- Apply date range filters
- Filter by expense type and status
- Reset filters with "Xóa lọc" button

### Managing Debts
- Switch to "Danh sách nợ chi" tab for debt management
- View overdue debts with warning indicators
- Track payment progress with debt statistics

## Technical Implementation

### State Management
- Redux Toolkit for state management
- Separate actions for payments and debts
- Loading states and error handling
- Optimistic updates for better UX

### Data Flow
1. Components dispatch thunk actions
2. Thunks handle API calls (currently mocked)
3. Reducers update state based on action results
4. Components re-render with new data

### Error Handling
- API error states with retry functionality
- Form validation with user feedback
- Empty state handling with appropriate messaging
- Loading indicators during async operations

## Future Enhancements

### API Integration
- Replace mock data with actual API endpoints
- Implement proper authentication headers
- Add request/response interceptors
- Handle API rate limiting

### Advanced Features
- Export to Excel functionality
- Bulk operations (delete, update status)
- Advanced filtering (date ranges, amount ranges)
- Receipt payment templates
- Attachment management
- Print receipt functionality

### Performance Optimizations
- Virtual scrolling for large datasets
- Debounced search with caching
- Memoized calculations
- Lazy loading of components

## Validation Results

✅ **Two-tab interface**: Implemented with proper tab switching
✅ **Independent filtering**: Each tab maintains separate filter state
✅ **Pagination**: Implemented with customizable page sizes
✅ **Empty states**: Clear messaging when no records found
✅ **Error handling**: Proper error states with retry options
✅ **Project standards**: Follows established folder structure and naming conventions
✅ **TypeScript**: Comprehensive type definitions and interfaces
✅ **Component design**: Follows single responsibility principle with proper splitting