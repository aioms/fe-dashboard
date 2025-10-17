# Component Design Guidelines

## Component Splitting Strategy

### When to Split Components

#### Size-Based Splitting
- **200+ lines**: Consider splitting into smaller components
- **Multiple responsibilities**: Each component should have a single, clear purpose
- **Complex render logic**: Extract complex JSX into separate components
- **Reusable patterns**: Extract patterns used in multiple places

#### Responsibility-Based Splitting
```typescript
// Before: Large, complex component
const CustomerDetail = ({ customerId }: { customerId: string }) => {
  // 300+ lines of logic for:
  // - Customer data fetching
  // - Form handling
  // - Address management
  // - Order history
  // - Contact information
  // - Action buttons
};

// After: Split into focused components
const CustomerDetail = ({ customerId }: { customerId: string }) => {
  return (
    <div className="customer-detail">
      <CustomerHeader customerId={customerId} />
      <CustomerInfo customerId={customerId} />
      <CustomerAddresses customerId={customerId} />
      <CustomerOrderHistory customerId={customerId} />
      <CustomerActions customerId={customerId} />
    </div>
  );
};
```

### Component Hierarchy Patterns

#### Container-Presentation Pattern
```typescript
// Container Component (handles logic)
const CustomerDetailContainer: React.FC<{ customerId: string }> = ({ customerId }) => {
  const { customer, loading, error } = useCustomer(customerId);
  const { updateCustomer, deleteCustomer } = useCustomerActions();

  if (loading) return <CustomerDetailSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <CustomerDetailPresentation
      customer={customer}
      onUpdate={updateCustomer}
      onDelete={deleteCustomer}
    />
  );
};

// Presentation Component (handles UI)
const CustomerDetailPresentation: React.FC<CustomerDetailProps> = ({
  customer,
  onUpdate,
  onDelete
}) => {
  return (
    <Card>
      <CustomerHeader customer={customer} />
      <CustomerInfo customer={customer} onUpdate={onUpdate} />
      <CustomerActions onDelete={() => onDelete(customer.id)} />
    </Card>
  );
};
```

#### Compound Component Pattern
```typescript
// Main component with sub-components
const CustomerForm = ({ customer, onSubmit }: CustomerFormProps) => {
  return (
    <Form onFinish={onSubmit}>
      <CustomerForm.PersonalInfo customer={customer} />
      <CustomerForm.ContactInfo customer={customer} />
      <CustomerForm.AddressInfo customer={customer} />
      <CustomerForm.Actions />
    </Form>
  );
};

// Sub-components
CustomerForm.PersonalInfo = ({ customer }: { customer: Customer }) => (
  <Card title="Personal Information">
    <Form.Item name="firstName" label="First Name">
      <Input defaultValue={customer.firstName} />
    </Form.Item>
    {/* More fields */}
  </Card>
);

CustomerForm.ContactInfo = ({ customer }: { customer: Customer }) => (
  <Card title="Contact Information">
    {/* Contact fields */}
  </Card>
);
```

## Best Practices for Concise Components

### Keep Components Focused
```typescript
// Good: Single responsibility
const CustomerName: React.FC<{ customer: Customer }> = ({ customer }) => {
  const fullName = `${customer.firstName} ${customer.lastName}`;
  
  return (
    <div className="customer-name">
      <h2>{fullName}</h2>
      {customer.isVip && <Badge text="VIP" />}
    </div>
  );
};

// Avoid: Multiple responsibilities
const CustomerEverything: React.FC<{ customerId: string }> = ({ customerId }) => {
  // Handles: data fetching, form state, validation, UI rendering, actions
  // This should be split into multiple components
};
```

### Extract Custom Hooks
```typescript
// Extract complex logic into custom hooks
const useCustomerDetail = (customerId: string) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomer(customerId)
      .then(setCustomer)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [customerId]);

  const updateCustomer = useCallback(async (updates: Partial<Customer>) => {
    // Update logic
  }, [customerId]);

  return { customer, loading, error, updateCustomer };
};

// Clean component using the hook
const CustomerDetail: React.FC<{ customerId: string }> = ({ customerId }) => {
  const { customer, loading, error, updateCustomer } = useCustomerDetail(customerId);

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!customer) return <NotFound />;

  return <CustomerDetailView customer={customer} onUpdate={updateCustomer} />;
};
```

### Use Composition Over Inheritance
```typescript
// Good: Composition with render props
const DataFetcher = <T,>({ 
  url, 
  children 
}: { 
  url: string; 
  children: (data: T | null, loading: boolean, error: string | null) => React.ReactNode;
}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch logic...

  return <>{children(data, loading, error)}</>;
};

// Usage
const CustomerList = () => (
  <DataFetcher<Customer[]> url="/api/customers">
    {(customers, loading, error) => {
      if (loading) return <Skeleton />;
      if (error) return <ErrorMessage error={error} />;
      return <CustomerTable customers={customers} />;
    }}
  </DataFetcher>
);
```

## Component Length Guidelines

### Maximum Recommended Lengths
- **Simple components**: 50-100 lines
- **Complex components**: 100-200 lines
- **Page components**: 150-300 lines (mostly composition)
- **Container components**: 100-150 lines

### Signs a Component Needs Splitting
1. **Multiple useState hooks** (>5) handling different concerns
2. **Large useEffect blocks** with multiple dependencies
3. **Complex conditional rendering** with nested ternary operators
4. **Repetitive JSX patterns** that could be extracted
5. **Mixed concerns** (data fetching + UI + business logic)

### Refactoring Strategies

#### Extract Sub-Components
```typescript
// Before: Long component with repetitive patterns
const CustomerForm = () => {
  return (
    <Form>
      <Card title="Personal Info">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      {/* Repeated pattern for other sections */}
    </Form>
  );
};

// After: Extract reusable FormSection component
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ 
  title, 
  children 
}) => (
  <Card title={title}>
    <Row gutter={16}>
      {children}
    </Row>
  </Card>
);

const FormField: React.FC<FormFieldProps> = ({ name, label, required, span = 12 }) => (
  <Col span={span}>
    <Form.Item name={name} label={label} rules={required ? [{ required: true }] : []}>
      <Input />
    </Form.Item>
  </Col>
);

const CustomerForm = () => (
  <Form>
    <FormSection title="Personal Info">
      <FormField name="firstName" label="First Name" required />
      <FormField name="lastName" label="Last Name" required />
    </FormSection>
    <FormSection title="Contact Info">
      <FormField name="email" label="Email" required />
      <FormField name="phone" label="Phone" />
    </FormSection>
  </Form>
);
```

#### Extract Business Logic
```typescript
// Extract form logic into custom hook
const useCustomerForm = (customer?: Customer) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CustomerFormData) => {
    setLoading(true);
    try {
      if (customer) {
        await updateCustomer(customer.id, values);
      } else {
        await createCustomer(values);
      }
      message.success('Customer saved successfully');
    } catch (error) {
      message.error('Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleSubmit };
};

// Clean component using the hook
const CustomerForm: React.FC<{ customer?: Customer }> = ({ customer }) => {
  const { form, loading, handleSubmit } = useCustomerForm(customer);

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={customer}>
      <CustomerFormFields />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {customer ? 'Update' : 'Create'} Customer
        </Button>
      </Form.Item>
    </Form>
  );
};
```

## Performance Considerations

### Memoization Strategies
```typescript
// Memoize expensive components
const CustomerCard = React.memo<CustomerCardProps>(({ customer, onEdit, onDelete }) => {
  return (
    <Card
      title={customer.name}
      actions={[
        <Button key="edit" onClick={() => onEdit(customer)}>Edit</Button>,
        <Button key="delete" danger onClick={() => onDelete(customer.id)}>Delete</Button>
      ]}
    >
      <CustomerInfo customer={customer} />
    </Card>
  );
});

// Memoize callbacks to prevent unnecessary re-renders
const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const handleEdit = useCallback((customer: Customer) => {
    // Edit logic
  }, []);

  const handleDelete = useCallback((customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  }, []);

  return (
    <div>
      {customers.map(customer => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
```

### Lazy Loading Components
```typescript
// Lazy load heavy components
const CustomerChart = React.lazy(() => import('./CustomerChart'));
const CustomerMap = React.lazy(() => import('./CustomerMap'));

const CustomerDetail: React.FC<{ customerId: string }> = ({ customerId }) => {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab}>
      <TabPane tab="Info" key="info">
        <CustomerInfo customerId={customerId} />
      </TabPane>
      <TabPane tab="Analytics" key="analytics">
        <Suspense fallback={<Skeleton />}>
          <CustomerChart customerId={customerId} />
        </Suspense>
      </TabPane>
      <TabPane tab="Location" key="location">
        <Suspense fallback={<Skeleton />}>
          <CustomerMap customerId={customerId} />
        </Suspense>
      </TabPane>
    </Tabs>
  );
};
```