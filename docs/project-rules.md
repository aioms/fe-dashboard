# Project Rules

## Project Structure and Organization

### Core Principles
- **Feature-based organization** over file-type organization
- **Consistent folder hierarchy** across all modules
- **Clear separation of concerns** between layers
- **Scalable architecture** that grows with the project

### Required Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Modal, etc.)
│   ├── form/           # Form-specific components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   └── [feature]/      # Feature-specific components
├── pages/              # Page-level components
│   └── [feature]/      # Feature pages (customers, products, etc.)
├── hooks/              # Custom React hooks
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices
│   └── middleware/     # Custom middleware
├── utils/              # Utility functions
├── contexts/           # React contexts
├── config/             # Configuration files
├── assets/             # Static assets
│   └── styles/         # Global styles
└── __tests__/          # Test files
```

### File Organization Rules
- **One component per file** with matching filename
- **Index files** for barrel exports in each folder
- **Co-locate related files** (component + styles + tests)
- **Use absolute imports** for src-level imports

## Naming Conventions

### Files and Folders
- **PascalCase** for component files: `CustomerDetail.tsx`
- **camelCase** for utility files: `dateUtils.ts`
- **kebab-case** for folders: `customer-management`
- **lowercase** for config files: `package.json`

### Components
```typescript
// Component names: PascalCase
const CustomerDetail: React.FC<CustomerDetailProps> = () => {};

// Props interfaces: ComponentName + Props
interface CustomerDetailProps {
  customerId: string;
}

// Event handlers: handle + Action
const handleSubmit = () => {};
const handleCustomerEdit = () => {};
```

### Variables and Functions
```typescript
// Variables: camelCase, descriptive
const customerData = await fetchCustomer(id);
const isLoadingCustomers = true;

// Functions: verb + noun pattern
const validateCustomerForm = (data: CustomerFormData) => {};
const formatCustomerName = (customer: Customer) => {};

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
```

### Redux Store
```typescript
// Slice names: camelCase
const customerSlice = createSlice({
  name: 'customers',
  // ...
});

// Action names: feature/action
'customers/fetchCustomers'
'customers/updateCustomer'
'customers/deleteCustomer'

// Selector names: select + Feature + Data
const selectCustomers = (state: RootState) => state.customers.list;
const selectCustomerById = (state: RootState, id: string) => 
  state.customers.list.find(customer => customer.id === id);
```

### CSS Classes (when not using CSS-in-JS)
```scss
// BEM methodology
.customer-detail {}
.customer-detail__header {}
.customer-detail__header--highlighted {}

// Utility classes: prefix with 'u-'
.u-text-center {}
.u-margin-bottom-large {}
```

## Import Organization
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { Button, Card, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

// 2. Internal modules (absolute imports)
import { Customer } from 'types/customer';
import { fetchCustomers } from 'store/slices/customerSlice';
import { useLoading } from 'hooks/useLoading';

// 3. Relative imports
import './CustomerDetail.scss';
```

## Code Quality Rules

### TypeScript Requirements
- **Strict mode enabled** in tsconfig.json
- **No any types** without explicit justification
- **Proper interface definitions** for all props and data structures
- **Generic types** for reusable components

### Component Rules
- **Maximum 200 lines** per component file
- **Single responsibility** principle
- **Props destructuring** in function signature
- **Default props** using ES6 default parameters

### Performance Rules
- **React.memo()** for components that receive stable props
- **useCallback()** for functions passed as props
- **useMemo()** for expensive calculations
- **Lazy loading** for route-level components

### Error Handling Rules
- **Error boundaries** for each major feature
- **Try-catch blocks** for all async operations
- **Meaningful error messages** for users
- **Error logging** with context information