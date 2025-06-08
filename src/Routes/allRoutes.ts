// auth
import UserProfile from "pages/Authentication/UserProfile";
import Login from "pages/Authentication/Login";
import Logout from "pages/Authentication/LogOut";

// dashboard
import UserManagement from "pages/Dashboards/User/UserManagement";

// product
import ProductList from "pages/Dashboards/Product/ProductList";

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

// supplier
import SupplierList from "pages/Dashboards/Supplier/SupplierList";
import SupplierDetail from "pages/Dashboards/Supplier/SupplierDetail";

// analytics
import AnalyticsReport from "pages/Dashboards/Inventory/AnalysisReport";

import CustomerList from "pages/Dashboards/Customer/CustomerList";

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

  // supplier
  { path: "/suppliers", component: SupplierList },
  { path: "/suppliers/:id", component: SupplierDetail },

  // customer
  { path: "/customers", component: CustomerList },

  // profile
  { path: "/user-profile", component: UserProfile },
];

const publicRoutes = [
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
];

export { authProtectedRoutes, publicRoutes };
