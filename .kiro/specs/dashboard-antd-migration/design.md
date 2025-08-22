# Design Document

## Overview

This document outlines the design for migrating the AIOM Dashboard from a custom Tailwind CSS-based UI to Ant Design (antd). The migration will transform the existing React TypeScript application to leverage Ant Design's comprehensive component ecosystem while maintaining all current functionality, state management, and business logic.

The migration strategy focuses on a component-by-component replacement approach, ensuring that each module can be migrated independently while maintaining system stability and functionality throughout the process.

## Architecture

### Current Architecture Analysis

The existing application follows a well-structured architecture:

- **Frontend Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit with createSelector for optimized state selection
- **Routing**: React Router v6 with protected and public routes
- **Styling**: Tailwind CSS with custom theme configuration
- **Layout System**: Custom layout components with sidebar, header, footer, and content areas
- **Component Structure**: Modular approach with feature-based organization

### Target Architecture

The migrated application will maintain the same architectural patterns while replacing UI components:

- **UI Framework**: Ant Design v5.x as the primary component library
- **Theme System**: Ant Design's ConfigProvider for global theming
- **Layout System**: Ant Design's Layout components (Layout, Sider, Header, Content, Footer)
- **Form Management**: Ant Design Form components with existing Formik integration where needed
- **Table Components**: Ant Design Table with advanced features (sorting, filtering, pagination)
- **Navigation**: Ant Design Menu components for sidebar navigation

### Migration Strategy

1. **Parallel Development**: Create new components alongside existing ones
2. **Incremental Replacement**: Replace components module by module
3. **Backward Compatibility**: Ensure new components work with existing Redux state and API calls
4. **Theme Consistency**: Maintain current branding and color schemes through Ant Design theming

## Components and Interfaces

### Core Layout Components

#### 1. Layout System Migration

**Current Structure:**
```
Layout/
├── index.tsx (Main layout wrapper)
├── Header.tsx (Top navigation bar)
├── Footer.tsx (Footer component)
├── VerticalLayout/
│   ├── Sidebar.tsx (Left sidebar navigation)
│   └── Index.tsx (Vertical layout wrapper)
├── HorizontalLayout/
│   └── index.tsx (Horizontal layout wrapper)
└── RightSidebar.tsx (Settings sidebar)
```

**Target Ant Design Structure:**
```typescript
// Main Layout Component using Ant Design
import { Layout, ConfigProvider } from 'antd';
const { Header, Sider, Content, Footer } = Layout;

interface LayoutProps {
  children: React.ReactNode;
  layoutType: string;
  layoutSidebarSizeType: string;
}

const AntdLayout: React.FC<LayoutProps> = ({ children, layoutType, layoutSidebarSizeType }) => {
  return (
    <ConfigProvider theme={customTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          collapsible
          collapsed={layoutSidebarSizeType === 'sm'}
          width={260}
          collapsedWidth={70}
        >
          <AntdSidebar />
        </Sider>
        <Layout>
          <Header>
            <AntdHeader />
          </Header>
          <Content>
            {children}
          </Content>
          <Footer>
            <AntdFooter />
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
```

#### 2. Navigation Menu Migration

**Current**: Custom sidebar with nested menu items
**Target**: Ant Design Menu component with SubMenu for nested items

```typescript
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItem[];
}

const AntdSidebar: React.FC = () => {
  const menuItems: MenuItem[] = transformMenuData(menuData);
  
  return (
    <Menu
      mode="inline"
      theme="dark"
      items={menuItems}
      selectedKeys={[currentPath]}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
    />
  );
};
```

### Feature Module Components

#### 1. Product Management Module

**Current Components to Migrate:**
- ProductList.tsx → AntdProductList.tsx
- ProductDetail → AntdProductDetail.tsx
- CreateProductModal → AntdCreateProductModal.tsx
- ImportProductModal → AntdImportProductModal.tsx
- PrintBarcodeModal → AntdPrintBarcodeModal.tsx

**Key Ant Design Components Used:**
- Table (with sorting, filtering, pagination)
- Modal (for create/edit/import dialogs)
- Form (with validation)
- Upload (for file imports)
- Button, Input, Select, DatePicker
- Drawer (for detailed views)

#### 2. Customer Management Module

**Migration Pattern:**
```typescript
// Current: Custom table with Tailwind styling
// Target: Ant Design Table with built-in features

import { Table, Button, Modal, Form, Input, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const AntdCustomerList: React.FC = () => {
  const columns = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: Customer) => (
        <Link to={`/customers/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record: Customer) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" />
          <Button icon={<EditOutlined />} size="small" />
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={customers}
      loading={loading}
      pagination={{
        current: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        total: totalCount,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
      onChange={handleTableChange}
    />
  );
};
```

#### 3. Receipt Management Modules

**Components to Migrate:**
- ReceiptImportCreate/List/Update
- ReceiptReturnCreate/List/Update  
- ReceiptCheckCreate/List/Update

**Key Features:**
- Complex forms with dynamic fields
- File upload capabilities
- Print functionality
- Status management
- Date range filtering

### Form Components Migration

#### Current Form Pattern (Formik + Custom Components)
```typescript
// Current approach
<Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ values, errors, touched, handleChange, handleBlur }) => (
    <Form>
      <div className="mb-3">
        <label className="inline-block mb-2 text-base font-medium">
          Tên sản phẩm
        </label>
        <input
          type="text"
          className="form-input"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.name && touched.name && (
          <div className="text-red-500">{errors.name}</div>
        )}
      </div>
    </Form>
  )}
</Formik>
```

#### Target Ant Design Form Pattern
```typescript
// Target approach
import { Form, Input, Button, message } from 'antd';

const AntdProductForm: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      message.success('Sản phẩm đã được tạo thành công');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo sản phẩm');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập tên sản phẩm' },
          { min: 2, message: 'Tên sản phẩm phải có ít nhất 2 ký tự' }
        ]}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Tạo sản phẩm
        </Button>
      </Form.Item>
    </Form>
  );
};
```

## Data Models

### Theme Configuration Model

```typescript
interface AntdThemeConfig {
  token: {
    colorPrimary: string;
    colorSuccess: string;
    colorWarning: string;
    colorError: string;
    colorInfo: string;
    colorBgBase: string;
    colorTextBase: string;
    borderRadius: number;
    fontFamily: string;
  };
  components: {
    Layout: {
      siderBg: string;
      headerBg: string;
      footerBg: string;
    };
    Menu: {
      darkItemBg: string;
      darkItemSelectedBg: string;
      darkItemHoverBg: string;
    };
    Table: {
      headerBg: string;
      rowHoverBg: string;
    };
  };
}
```

### Component Migration Mapping

```typescript
interface ComponentMigrationMap {
  // Layout Components
  'custom-sidebar': 'antd-menu';
  'custom-header': 'antd-layout-header';
  'custom-footer': 'antd-layout-footer';
  
  // Form Components
  'custom-input': 'antd-input';
  'custom-select': 'antd-select';
  'custom-datepicker': 'antd-datepicker';
  'custom-upload': 'antd-upload';
  
  // Display Components
  'custom-table': 'antd-table';
  'custom-modal': 'antd-modal';
  'custom-drawer': 'antd-drawer';
  'custom-card': 'antd-card';
  
  // Feedback Components
  'custom-toast': 'antd-message';
  'custom-alert': 'antd-alert';
  'custom-loading': 'antd-spin';
}
```

## Error Handling

### Form Validation Migration

**Current Approach**: Formik + Yup validation
**Target Approach**: Ant Design Form built-in validation + custom validators

```typescript
// Custom validation rules for Ant Design forms
const customValidationRules = {
  vietnamesePhone: {
    pattern: /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/,
    message: 'Số điện thoại không hợp lệ',
  },
  vietnameseText: {
    pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
    message: 'Chỉ được nhập chữ cái tiếng Việt',
  },
  positiveNumber: {
    validator: (_: any, value: number) => {
      if (value && value <= 0) {
        return Promise.reject('Giá trị phải lớn hơn 0');
      }
      return Promise.resolve();
    },
  },
};
```

### API Error Handling

Maintain existing error handling patterns while integrating with Ant Design's message system:

```typescript
// Error handling wrapper for API calls
const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    message.error('Phiên đăng nhập đã hết hạn');
    // Redirect to login
  } else if (error.response?.status === 403) {
    message.error('Bạn không có quyền thực hiện hành động này');
  } else {
    message.error(error.message || 'Có lỗi xảy ra');
  }
};
```

## Testing Strategy

### Component Testing Approach

1. **Unit Tests**: Test individual Ant Design component integrations
2. **Integration Tests**: Test component interactions with Redux state
3. **Visual Regression Tests**: Ensure UI consistency during migration
4. **Accessibility Tests**: Verify Ant Design components meet accessibility standards

### Migration Testing Phases

```typescript
// Test structure for migrated components
describe('AntdProductList', () => {
  it('should render product data correctly', () => {
    // Test data rendering
  });
  
  it('should handle table sorting and filtering', () => {
    // Test table interactions
  });
  
  it('should integrate with Redux state correctly', () => {
    // Test state management
  });
  
  it('should maintain existing API integration', () => {
    // Test API calls
  });
});
```

### Performance Considerations

1. **Bundle Size**: Monitor bundle size impact of Ant Design
2. **Tree Shaking**: Ensure only used Ant Design components are bundled
3. **Lazy Loading**: Implement code splitting for migrated modules
4. **Theme Optimization**: Optimize theme configuration for performance

```typescript
// Optimized Ant Design imports
import { Table } from 'antd/es/table';
import { Button } from 'antd/es/button';
import { Form } from 'antd/es/form';

// Instead of importing entire antd library
// import { Table, Button, Form } from 'antd';
```

## Integration Points

### Redux Integration

Maintain existing Redux patterns while adapting to Ant Design components:

```typescript
// Example: Integrating Ant Design Table with Redux
const AntdProductList: React.FC = () => {
  const dispatch = useDispatch();
  const { products, loading, pagination } = useSelector(selectProductState);
  
  const handleTableChange = (paginationConfig: any, filters: any, sorter: any) => {
    dispatch(updateProductFilters({
      page: paginationConfig.current - 1,
      pageSize: paginationConfig.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
      filters,
    }));
  };
  
  return (
    <Table
      dataSource={products}
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
      // ... other props
    />
  );
};
```

### Third-party Library Integration

Ensure compatibility with existing third-party libraries:

1. **ApexCharts**: Integrate charts within Ant Design Card components
2. **React Dropzone**: Combine with Ant Design Upload component
3. **React Router**: Maintain routing with Ant Design navigation
4. **i18next**: Continue internationalization with Ant Design components

### API Integration

Preserve all existing API integration patterns:

```typescript
// Maintain existing API service structure
const productService = {
  getProducts: (params: ProductListParams) => api.get('/products', { params }),
  createProduct: (data: CreateProductData) => api.post('/products', data),
  updateProduct: (id: string, data: UpdateProductData) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

// Integrate with Ant Design components
const AntdProductForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await productService.createProduct(values);
      message.success('Product created successfully');
      form.resetFields();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of component
};
```