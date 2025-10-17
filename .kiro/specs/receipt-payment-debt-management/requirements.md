# Requirements Document

## Introduction

The ReceiptPayment/ReceiptDebt Management feature is a comprehensive financial management system that allows users to track, manage, and analyze all income (ReceiptPayment) and expense (ReceiptDebt) transactions within the AIOM Dashboard. This feature provides a centralized view of financial flows, debt management, and payment tracking to help businesses maintain accurate financial records and make informed decisions.

The system will be integrated into the Sales Management section of the sidebar navigation and will provide two main tabs for managing income and expense transactions separately, while maintaining a unified interface for filtering, searching, and reporting.

## Requirements

### Requirement 1

**User Story:** As a business user, I want to view and manage all income transactions (ReceiptPayment) in a dedicated tab, so that I can track money received from customers and other sources.

#### Acceptance Criteria

1. WHEN the user navigates to ReceiptPayment/ReceiptDebt Management THEN the system SHALL display a tabbed interface with "Quản lý thu" and "Quản lý chi" tabs
2. WHEN the user selects the "Quản lý thu" tab THEN the system SHALL display a list of all income transactions with columns for transaction code, date, income type, payer, amount, and status
3. WHEN the user views the ReceiptPayment tab THEN the system SHALL display summary cards showing total income, total outstanding receivables, overdue receivables count, and settled amounts for the selected period
4. WHEN the user interacts with the Thu list THEN the system SHALL provide sorting capabilities for date, amount, and status columns
5. WHEN the user clicks on a transaction code THEN the system SHALL navigate to the detailed view of that income transaction

### Requirement 2

**User Story:** As a business user, I want to view and manage all expense transactions (ReceiptPayment) in a dedicated tab, so that I can track money paid to suppliers and other expenses.

#### Acceptance Criteria

1. WHEN the user selects the "Quản lý chi" tab THEN the system SHALL display a list of all expense transactions with columns for transaction code, payment date, expense type, payment object, amount, payment method, and status
2. WHEN the user views the ReceiptPayment tab THEN the system SHALL display summary cards showing total expenses, total debt payments, draft transactions count, and paid amounts for the selected period
3. WHEN the user interacts with the ReceiptPayment list THEN the system SHALL provide sorting capabilities for payment date, amount, and status columns
4. WHEN the user clicks on a transaction code THEN the system SHALL navigate to the detailed view of that expense transaction
5. WHEN the user views expense transactions THEN the system SHALL display expense types including "supplier_payment", "transportation", "utilities", "rent", "labor", and "other" with custom names for "other" type

### Requirement 3

**User Story:** As a business user, I want to filter and search through ReceiptPayment/ReceiptDebt transactions, so that I can quickly find specific transactions or analyze data for specific periods and criteria.

#### Acceptance Criteria

1. WHEN the user accesses either Thu or Chi tab THEN the system SHALL provide a search bar that allows searching by transaction code, customer/supplier name
2. WHEN the user uses the advanced filters THEN the system SHALL provide filtering options for date range (from date - to date), transaction status (outstanding, partially paid, fully settled), and transaction type
3. WHEN the user applies time-based filters THEN the system SHALL provide quick filter options for week, month, quarter, and year
4. WHEN the user applies filters for expense type THEN the system SHALL allow filtering by specific expense categories
5. WHEN the user applies filters for payer/payee THEN the system SHALL allow filtering by specific customers or suppliers
6. WHEN filters are applied THEN the system SHALL update both the transaction list and summary statistics to reflect the filtered data

### Requirement 4

**User Story:** As a business user, I want to see comprehensive summary statistics for ReceiptPayment transactions, so that I can quickly understand the financial status and payment statuses.

#### Acceptance Criteria

1. WHEN the user views the ReceiptPayment tab THEN the system SHALL display summary cards at the top showing key financial metrics
2. WHEN displaying ReceiptPayment summary THEN the system SHALL show "Tổng Chi" (total expenses), "Đã Thanh Toán" (paid transactions), "Công Nợ Chi" (debt payment transactions), and "Nháp" (draft transactions)
3. WHEN displaying transaction status breakdown THEN the system SHALL show counts and amounts for each status: draft, paid, debt_payment, and cancelled
4. WHEN there are cancelled transactions THEN the system SHALL display cancelled amounts and counts with appropriate styling
5. WHEN summary statistics are displayed THEN the system SHALL format all monetary values in Vietnamese Dong (VND) with proper thousand separators

### Requirement 5

**User Story:** As a business user, I want to perform actions on ReceiptPayment transactions, so that I can create new transactions and export data for reporting purposes.

#### Acceptance Criteria

1. WHEN the user is in the ReceiptPayment tab THEN the system SHALL provide a "Tạo Phiếu Chi" (Create Expense Receipt) button
2. WHEN the user clicks the create button THEN the system SHALL open a modal or navigate to the transaction creation form
3. WHEN the user wants to export data THEN the system SHALL provide an "Xuất Excel" (Export Excel) button that exports the currently filtered transaction list
4. WHEN the user exports data THEN the system SHALL include all visible columns and apply current filters to the exported data
5. WHEN creating transactions THEN the system SHALL support all expense types: supplier_payment, transportation, utilities, rent, labor, and other with custom naming

### Requirement 6

**User Story:** As a business user, I want to access the ReceiptPayment Management feature from the main navigation, so that I can easily navigate to financial management functions.

#### Acceptance Criteria

1. WHEN the user views the sidebar navigation THEN the system SHALL display "Quản lý Chi" (Expense Management) as a menu item under the "Quản lý bán hàng" (Sales Management) section
2. WHEN the user clicks on the Expense Management menu item THEN the system SHALL navigate to the ReceiptPayment management page
3. WHEN the navigation item is displayed THEN the system SHALL use appropriate Vietnamese labeling consistent with other menu items
4. WHEN the user is on the ReceiptPayment management page THEN the system SHALL highlight the corresponding menu item as active
5. WHEN the page loads THEN the system SHALL display a proper breadcrumb navigation showing the current location

### Requirement 7

**User Story:** As a business user, I want to view transaction details and perform actions on individual transactions, so that I can manage specific expense records effectively.

#### Acceptance Criteria

1. WHEN the user clicks on a transaction in the list THEN the system SHALL display transaction details including all relevant information from the database schema
2. WHEN viewing transaction details THEN the system SHALL show transaction code, payment date, expense type, expense type name (for custom types), payment object, amount, payment method, notes, attachments, status, supplier reference, and receipt import reference
3. WHEN the transaction status allows editing THEN the system SHALL provide edit functionality for modifiable fields including notes, attachments, and status
4. WHEN the transaction is in "draft" status THEN the system SHALL provide options to update status to paid, debt_payment, or cancelled
5. WHEN viewing transaction details THEN the system SHALL display attachments with proper file information (name, path, type, size, upload date) and provide download functionality

### Requirement 8

**User Story:** As a business user, I want the ReceiptPayment management interface to be responsive and accessible, so that I can use it effectively on different devices and screen sizes.

#### Acceptance Criteria

1. WHEN the user accesses the page on mobile devices THEN the system SHALL display a responsive layout that adapts to smaller screen sizes
2. WHEN the user interacts with the interface THEN the system SHALL provide proper loading states and error handling
3. WHEN the user uses keyboard navigation THEN the system SHALL support proper tab order and keyboard accessibility
4. WHEN the user has visual impairments THEN the system SHALL provide proper ARIA labels and screen reader support
5. WHEN the page loads THEN the system SHALL display proper loading indicators and handle empty states gracefully