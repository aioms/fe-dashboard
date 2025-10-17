# Folder Organization

## Project Component Categorization

### Core Architecture Layers

#### 1. Presentation Layer (`/src/components/`)
**Purpose**: Reusable UI components that handle presentation logic

```
components/
├── common/              # Generic, reusable components
│   ├── Button/
│   ├── Modal/
│   ├── Table/
│   └── index.ts        # Barrel export
├── form/               # Form-specific components
│   ├── FormField/
│   ├── FormValidation/
│   └── FormWizard/
├── layout/             # Layout and navigation
│   ├── Header/
│   ├── Sidebar/
│   ├── Footer/
│   └── MainLayout/
├── charts/             # Data visualization
├── loading/            # Loading states and spinners
├── error/              # Error handling components
└── [feature-specific]/ # Feature-specific components
    ├── CustomerCard/
    ├── ProductGrid/
    └── InventoryStatus/
```

#### 2. Page Layer (`/src/pages/`)
**Purpose**: Route-level components that compose smaller components

```
pages/
├── auth/
│   ├── Login/
│   ├── Register/
│   └── ForgotPassword/
├── customers/
│   ├── CustomerList/
│   ├── CustomerDetail/
│   ├── CustomerForm/
│   └── index.ts
├── products/
├── inventory/
├── suppliers/
├── receipts/
├── users/
└── error/
    ├── NotFound/
    └── ServerError/
```

#### 3. Business Logic Layer (`/src/hooks/`, `/src/store/`, `/src/utils/`)

**Custom Hooks** (`/src/hooks/`):
```
hooks/
├── useForm.ts          # Form state management
├── useTable.ts         # Table functionality
├── useLoading.ts       # Loading state management
├── useErrorHandler.ts  # Error handling
├── useNavigation.ts    # Navigation helpers
└── useSession.ts       # Authentication state
```

**State Management** (`/src/store/`):
```
store/
├── index.ts           # Store configuration
├── slices/            # Redux slices
│   ├── authSlice.ts
│   ├── customerSlice.ts
│   ├── productSlice.ts
│   └── uiSlice.ts
└── middleware/        # Custom middleware
    ├── apiMiddleware.ts
    └── errorMiddleware.ts
```

**Utilities** (`/src/utils/`):
```
utils/
├── dateUtils.ts       # Date formatting and manipulation
├── validation.ts      # Form validation helpers
├── errorHandling.ts   # Error processing utilities
├── stateUtils.ts      # State management helpers
├── accessibility.ts   # A11y utilities
└── responsive.ts      # Responsive design helpers
```

#### 4. Configuration Layer (`/src/config/`, `/src/contexts/`)

**Configuration** (`/src/config/`):
```
config/
├── antd-theme.ts      # Ant Design theme configuration
├── theme-system.ts    # Custom theme system
├── api.ts             # API configuration
└── constants.ts       # Application constants
```

**Contexts** (`/src/contexts/`):
```
contexts/
├── AuthContext.tsx    # Authentication context
├── ThemeContext.tsx   # Theme management
└── NotificationContext.tsx
```

## Suggested Folder Hierarchy and Purpose

### Feature-Based Organization Pattern

For larger features, use this structure:
```
src/pages/customers/
├── components/        # Customer-specific components
│   ├── CustomerCard/
│   ├── CustomerForm/
│   └── CustomerFilters/
├── hooks/            # Customer-specific hooks
│   ├── useCustomers.ts
│   └── useCustomerForm.ts
├── types/            # Customer-specific types
│   └── customer.types.ts
├── utils/            # Customer-specific utilities
│   └── customerValidation.ts
├── CustomerList.tsx  # Main page components
├── CustomerDetail.tsx
└── index.ts          # Barrel export
```

### Asset Organization (`/src/assets/`)
```
assets/
├── images/
│   ├── icons/
│   ├── logos/
│   └── illustrations/
├── styles/
│   ├── globals.scss
│   ├── variables.scss
│   ├── mixins.scss
│   └── components/
└── fonts/
```

### Testing Organization (`/src/__tests__/`)
```
__tests__/
├── unit/              # Unit tests
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/       # Integration tests
│   ├── pages/
│   └── api/
├── e2e/              # End-to-end tests
├── accessibility/     # A11y tests
├── performance/       # Performance tests
└── utils/            # Test utilities
    ├── testUtils.tsx
    ├── mockData.ts
    └── testSetup.ts
```

## File Naming and Organization Rules

### Component Files
```
ComponentName/
├── ComponentName.tsx     # Main component
├── ComponentName.test.tsx # Tests
├── ComponentName.scss    # Styles (if not using CSS-in-JS)
├── ComponentName.stories.tsx # Storybook stories
├── types.ts             # Component-specific types
└── index.ts             # Barrel export
```

### Page Files
```
PageName/
├── PageName.tsx         # Main page component
├── PageName.test.tsx    # Page tests
├── components/          # Page-specific components
├── hooks/              # Page-specific hooks
└── index.ts            # Barrel export
```

### Utility Files
- **Single purpose per file**: Each utility file should have a focused responsibility
- **Descriptive names**: `dateUtils.ts`, `validationHelpers.ts`
- **Barrel exports**: Use index.ts files for clean imports

### Import/Export Strategy
```typescript
// Barrel export example (index.ts)
export { default as CustomerList } from './CustomerList';
export { default as CustomerDetail } from './CustomerDetail';
export { default as CustomerForm } from './CustomerForm';

// Usage
import { CustomerList, CustomerDetail } from 'pages/customers';
```

## Scalability Considerations

### Growing the Project
- **Start simple**: Begin with basic folder structure
- **Refactor when needed**: Move to feature-based organization as features grow
- **Maintain consistency**: Follow established patterns when adding new features
- **Document decisions**: Update this guide when making structural changes

### Code Splitting Strategy
- **Route-level splitting**: Each page should be lazy-loaded
- **Feature-level splitting**: Large features can be split into separate bundles
- **Component-level splitting**: Heavy components should be lazy-loaded

### Dependency Management
- **Clear boundaries**: Each layer should have clear dependencies
- **Avoid circular dependencies**: Use dependency injection when needed
- **Shared utilities**: Keep shared code in appropriate utility folders