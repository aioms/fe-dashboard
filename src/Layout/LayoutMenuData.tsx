import {
  CalendarDays,
  MonitorDot,
  PictureInPicture2,
  RadioTower,
  ScrollText,
} from "lucide-react";

const menuData: any = [
  {
    label: "ADMIN, SUPERVISOR",
    isTitle: true,
  },
  {
    id: "auth-dashboard",
    label: "Quản lý người dùng",
    link: "/#",
    icon: <MonitorDot />,
    subItems: [
      {
        id: "user-auth-dashboard",
        label: "Người dùng",
        link: "/users",
        parentId: "auth-dashboard",
      },
    ],
  },
  {
    label: "USER",
    isTitle: true,
  },
  {
    id: "product-dashboard",
    label: "Quản lý hàng hóa",
    link: "/#",
    icon: <PictureInPicture2 />,
    subItems: [
      {
        id: "products-page",
        label: "Hàng hóa",
        link: "/products",
        parentId: "product-dashboard",
      },
      {
        id: "import-product-page",
        label: "Nhập hàng",
        link: "/#",
        parentId: "product-dashboard",
        subItems: [
          {
            id: "create-receipt-import-page",
            label: "Tạo phiếu nhập",
            link: "/receipt-import/create",
            parentId: "product-dashboard",
          },
          {
            id: "list-receipt-import-page",
            label: "Danh sách phiếu nhập",
            link: "/receipt-import/list",
            parentId: "product-dashboard",
          },
        ],
      },
      {
        id: "return-product-page",
        label: "Trả hàng",
        link: "/#",
        parentId: "product-dashboard",
        subItems: [
          {
            id: "create-receipt-return-page",
            label: "Tạo phiếu trả",
            link: "/receipt-return/create",
            parentId: "product-dashboard",
          },
          {
            id: "list-receipt-return-page",
            label: "Danh sách phiếu trả",
            link: "/receipt-return/list",
            parentId: "product-dashboard",
          },
        ],
      },
      {
        id: "receipt-check-page",
        label: "Quản lý kho",
        link: "/#",
        parentId: "product-dashboard",
        subItems: [
          {
            id: "list-receipt-check-page",
            label: "Danh sách phiếu kiểm",
            link: "/receipt-check/list",
            parentId: "product-dashboard",
          },
          {
            id: "analysis-receipt-check-page",
            label: "Phân tích kho",
            link: "/receipt-check/analysis-inventory",
            parentId: "product-dashboard",
          },
          {
            id: "create-receipt-check-page",
            label: "Tạo phiếu kiểm",
            link: "/receipt-check/create",
            parentId: "product-dashboard",
            isHide: true,
          },
          {
            id: "update-receipt-check-page",
            label: "Cập nhật phiếu kiểm",
            link: "/receipt-check/update",
            parentId: "product-dashboard",
            isHide: true,
          },
        ],

      }
    ],
  },
  {
    id: "sales-dashboard",
    label: "Quản lý bán hàng",
    link: "/#",
    icon: <CalendarDays />,
    subItems: [
      {
        id: "customer-page",
        label: "Khách hàng",
        link: "/customers",
        parentId: "sales-dashboard",
      },
      {
        id: "suppliers-page",
        label: "Nhà cung cấp",
        link: "/suppliers",
        parentId: "sales-dashboard",
      },
      {
        id: "sales-handbook-page",
        label: "Sổ tay bán hàng",
        link: "/sales-handbook",
        parentId: "sales-dashboard",
      },
      {
        id: "bill-page",
        label: "Hóa đơn",
        link: "/orders",
        parentId: "sales-dashboard",
      },
      {
        id: "sales-channel-page",
        label: "Kênh bán",
        link: "/sales-channel",
        parentId: "sales-dashboard",
      },
    ],
  },
  {
    id: "finance-dashboard",
    label: "Quản lý tài chính",
    icon: <RadioTower />,
    subItems: [
      {
        id: "revenue-page",
        label: "Doanh thu",
        link: "/revenue",
        parentId: "finance-dashboard",
      },
      {
        id: "report-page",
        label: "Báo cáo thu chi",
        link: "/report",
        parentId: "finance-dashboard",
      },
      {
        id: "analytics-page",
        label: "Phân tích bán hàng",
        link: "/analytics",
        parentId: "finance-dashboard",
      },
    ],
  },
  {
    id: "hr-dashboard",
    label: "Quản lý nhân sự",
    icon: <RadioTower />,
    subItems: [
      {
        id: "hr-page",
        label: "Nhân sự",
        link: "/hr",
        parentId: "hr-dashboard",
      },
      {
        id: "checkin-page",
        label: "Chấm công",
        link: "/check-in",
        parentId: "hr-dashboard",
      },
      {
        id: "salary-page",
        label: "Tính lương",
        link: "/salary",
        parentId: "hr-dashboard",
      },
    ],
  },
  {
    id: "notes",
    label: "Notes",
    icon: <ScrollText />,
    link: "#",
    parentId: 2,
  },
];

export { menuData };
