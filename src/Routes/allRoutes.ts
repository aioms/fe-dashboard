// auth
import UserProfile from "pages/Authentication/UserProfile";
import Login from "pages/Authentication/Login";
import Logout from "pages/Authentication/LogOut";

// dashboard
import UserManagement from "pages/Dashboards/User/UserManagement";

// product
import ProductList from "pages/Dashboards/Product/ProductList";
import ProductDetail from "pages/Dashboards/Product/ProductDetail";

// receipt import
import ReceiptImportCreate from "pages/Dashboards/Receipt/ReceiptImport/ReceiptImportCreate";
import ReceiptImportUpdate from "pages/Dashboards/Receipt/ReceiptImport/ReceiptImportUpdate";
import ReceiptImportList from "pages/Dashboards/Receipt/ReceiptImport/ReceiptImportList";

// receipt return
import ReceiptReturnCreate from "pages/Dashboards/Receipt/ReceiptReturn/ReceiptReturnCreate";
import ReceiptReturnUpdate from "pages/Dashboards/Receipt/ReceiptReturn/ReceiptReturnUpdate";
import ReceiptReturnList from "pages/Dashboards/Receipt/ReceiptReturn/ReceiptReturnList";

// receipt check
import ReceiptCheckCreate from "pages/Dashboards/Receipt/ReceiptCheck/ReceiptCheckCreate";
import ReceiptCheckUpdate from "pages/Dashboards/Receipt/ReceiptCheck/ReceiptCheckUpdate";
import ReceiptCheckList from "pages/Dashboards/Receipt/ReceiptCheck/ReceiptCheckList";

// receipt payment
import ReceiptPaymentManagement from "pages/Dashboards/Receipt/ReceiptPayment/ReceiptPaymentManagement";
import ReceiptPaymentCreate from "pages/Dashboards/Receipt/ReceiptPayment/ReceiptPaymentCreate";
import ReceiptPaymentDetail from "pages/Dashboards/Receipt/ReceiptPayment/ReceiptPaymentDetail";
import ReceiptDebtDetail from "pages/Dashboards/Receipt/ReceiptPayment/ReceiptDebtDetail";

// supplier
import SupplierList from "pages/Dashboards/Supplier/SupplierList";
import SupplierDetail from "pages/Dashboards/Supplier/SupplierDetail";

// analytics
import AnalyticsReport from "pages/Dashboards/Inventory/AnalysisReport";

import CustomerList from "pages/Dashboards/Customer/CustomerList";
import CustomerDetail from "pages/Dashboards/Customer/CustomerDetail";

// order
import OrderList from "pages/Dashboards/Order/OrderList";
import OrderDetail from "pages/Dashboards/Order/OrderDetail";

interface RouteObject {
  path: string;
  component: React.ComponentType<any>; // Use React.ComponentType to specify the type of the component
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // Dashboard
  { path: "/", component: Login },
  { path: "/users", component: UserManagement },

  // product
  { path: "/products", component: ProductList },
  { path: "/products/:id", component: ProductDetail },

  // receipt import
  { path: "/receipt-import/create", component: ReceiptImportCreate },
  { path: "/receipt-import/update", component: ReceiptImportUpdate },
  { path: "/receipt-import/list", component: ReceiptImportList },

  // receipt return
  { path: "/receipt-return/create", component: ReceiptReturnCreate },
  { path: "/receipt-return/update", component: ReceiptReturnUpdate },
  { path: "/receipt-return/list", component: ReceiptReturnList },

  // receipt check
  { path: "/receipt-check/create", component: ReceiptCheckCreate },
  { path: "/receipt-check/update", component: ReceiptCheckUpdate },
  { path: "/receipt-check/list", component: ReceiptCheckList },
  { path: "/receipt-check/analysis-inventory", component: AnalyticsReport },

  // receipt payment
  { path: "/receipt-payment", component: ReceiptPaymentManagement },
  { path: "/receipt-payment/create", component: ReceiptPaymentCreate },
  { path: "/receipt-payment/detail/:id", component: ReceiptPaymentDetail },
  { path: "/receipt-debt/detail/:id", component: ReceiptDebtDetail },

  // supplier
  { path: "/suppliers", component: SupplierList },
  { path: "/suppliers/:id", component: SupplierDetail },

  // customer
  { path: "/customers", component: CustomerList },
  { path: "/customers/:id", component: CustomerDetail },

  // order
  { path: "/orders", component: OrderList },
  { path: "/orders/:id", component: OrderDetail },

  // profile
  { path: "/user-profile", component: UserProfile },
];

const publicRoutes = [
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
];

export { authProtectedRoutes, publicRoutes };
