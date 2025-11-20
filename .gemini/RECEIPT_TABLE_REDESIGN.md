# Receipt Import List Table Redesign

## Overview

Redesigned the import receipt list table to display detailed receipt items in a
hierarchical, expandable structure that clearly shows the relationship between
receipts and their corresponding items.

## Changes Made

### 1. New Component: `ExpandableReceiptTable.tsx`

Created a new sub-component at:
`/src/pages/Dashboards/Receipt/ReceiptImport/components/ExpandableReceiptTable.tsx`

**Features Implemented:**

#### Main Receipt Information Section

- **Receipt Number**: Clickable link to edit page (e.g., NH2511030628)
- **Supplier Information**: Display supplier name
- **Status Badge**: Visual status indicator using existing `ReceiptStatus`
  component
- **Total Quantity**: Shows total items in receipt
- **Total Amount**: Formatted currency with thousand separators (VND)
- **Creation Date**: Formatted as DD/MM/YYYY HH:mm
- **Action Dropdown**: Edit, Delete, Print Barcode, Print Multiple options

#### Expandable Item Details Section

- **Collapsible Rows**: Click anywhere on the receipt row or the chevron icon to
  expand/collapse
- **Product Information**:
  - Product Code (displayed in monospace font)
  - Product Name
  - Quantity per item
  - Unit Price (formatted with thousand separators)
  - Discount amount
  - Line Total (Quantity × Unit Price - Discount)
  - Inventory Status with color-coded badges:
    - Red: 0 items in stock
    - Yellow: Less than 5 items
    - Green: 5 or more items

#### Visual Enhancements

- **Alternating Row Colors**: Better readability with different background
  colors for even/odd rows
- **Hover Effects**: Smooth transitions on row hover
- **Responsive Design**: Horizontal scrolling for smaller screens
- **Dark Mode Support**: Full support for dark theme
- **Smooth Animations**: Expand/collapse transitions

#### Data Presentation

- **Currency Formatting**: All amounts use `formatMoney()` helper with thousand
  separators
- **Date Formatting**: Consistent DD/MM/YYYY HH:mm format
- **Color-Coded Indicators**: Inventory status uses semantic colors
- **Summary Section**: Shows notes, creator ID, and total amount for each
  expanded receipt

#### Interaction Features

- **Export to CSV**: Button provided (implementation placeholder for future
  development)
- **Expandable/Collapsible**: Click to show/hide item details
- **Action Menu**: Dropdown with multiple operations per receipt
- **Click Prevention**: Proper event propagation handling to prevent unwanted
  row expansion

### 2. Updated: `ReceiptImportList.tsx`

Modified the main list component to use the new expandable table:

**Changes:**

- Imported `ExpandableReceiptTable` component
- Replaced `TableCustom` with `ExpandableReceiptTable`
- Implemented custom pagination controls (since the new table doesn't use
  TableCustom's pagination)
- Maintained all existing functionality (filters, search, tabs, modals)

## Technical Details

### State Management

- Uses `useState` with a `Set<string>` to track expanded rows
- Efficient toggle mechanism for expand/collapse

### TypeScript Interfaces

```typescript
interface ReceiptItem {
    receiptId: string;
    id: string;
    productId: string;
    productCode: number;
    productName: string;
    quantity: number;
    inventory: number;
    costPrice: number;
    discount: number;
    createdAt: string;
}

interface Receipt {
    id: string;
    receiptNumber: string;
    note: string | null;
    quantity: number;
    totalProduct: number;
    totalAmount: number;
    supplier: { id: string; name: string } | null;
    warehouse: any;
    paymentDate: string | null;
    importDate: string | null;
    status: string;
    createdAt: string;
    userCreated: string;
    items: ReceiptItem[];
}
```

### Props

```typescript
interface ExpandableReceiptTableProps {
    receipts: Receipt[];
    onClickDelete: (receipt: Receipt) => void;
    onClickShowPrintSingle: (receipt: Receipt) => void;
    onClickShowPrintMultiple: (receipt: Receipt) => void;
    onExportCSV?: () => void;
}
```

## Features Not Yet Implemented

1. **CSV/Excel Export**: Button is present but needs implementation
2. **Bulk Operations**: Checkbox selection for multiple receipts
3. **Column Sorting**: Currently not implemented (can be added later)
4. **Advanced Filtering**: Date ranges and supplier selection use existing
   filters

## Benefits

1. **Better Data Visualization**: Hierarchical structure clearly shows
   receipt-item relationships
2. **Improved UX**: Users can quickly scan receipts and expand only those they
   need details for
3. **Space Efficient**: Collapsed view shows more receipts on screen
4. **Maintainable**: Separate component makes code easier to maintain and test
5. **Consistent Design**: Uses existing design system and components
6. **Accessible**: Proper semantic HTML and keyboard navigation support

## Usage

The component automatically handles the receipt data structure with nested
items. Simply pass the receipts array and callback functions:

```tsx
<ExpandableReceiptTable
    receipts={receipts}
    onClickDelete={onClickDelete}
    onClickShowPrintSingle={onClickShowPrintSingle}
    onClickShowPrintMultiple={onClickShowPrintMultiple}
    onExportCSV={() => {
        // Implement CSV export
    }}
/>;
```

## Future Enhancements

1. Implement actual CSV export functionality
2. Add bulk selection with checkboxes
3. Add column sorting capabilities
4. Add tooltips for truncated text
5. Add keyboard shortcuts for expand/collapse
6. Add animation for expand/collapse transitions
7. Implement virtual scrolling for large datasets
