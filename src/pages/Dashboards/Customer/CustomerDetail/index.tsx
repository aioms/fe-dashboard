import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronLeft } from "lucide-react";

import { request } from "helpers/axios";
import { IHttpResponse } from "types";
import type { ICustomer, ISalesOrder, IDebtRecord } from "./index.d";
import withRouter from "Common/withRouter";

// Components
import BreadCrumb from "Common/BreadCrumb";
import Tab from "Common/Components/Tab/Tab";
import { Nav } from "Common/Components/Tab/Nav";
import CustomerInformation from "./components/CustomerInfomation";
import SalesHistory from "./components/SalesHistory";
import OutstandingDebt from "./components/OutstandingDebt";

function CustomerDetail(props: any) {
  const { id } = useParams();
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [salesOrders, setSalesOrders] = useState<ISalesOrder[]>([]);
  const [debtRecords, setDebtRecords] = useState<IDebtRecord[]>([]);

  const handleBackToList = () => {
    props.router.navigate("/customers");
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response: IHttpResponse = await request.get(`/customers/${id}`);
        if (response.success) {
          setCustomer(response.data);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    const fetchSalesHistory = async () => {
      try {
        const response: IHttpResponse = await request.get(
          `/customers/${id}/sales-history`
        );
        if (response.success) {
          setSalesOrders(response.data);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    const fetchDebtRecords = async () => {
      try {
        const response: IHttpResponse = await request.get(
          `/customers/${id}/debt-records`
        );
        if (response.success) {
          setDebtRecords(response.data);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    // Mock data for demonstration
    setSalesOrders([
      {
        id: "1",
        orderCode: "DH240520-01",
        createdAt: "2024-05-20",
        transactionType: "sale",
        quantity: 5,
        totalAmount: 1500000,
        status: "Hoàn thành",
      },
      {
        id: "2",
        orderCode: "TH240430-02",
        createdAt: "2024-04-30",
        transactionType: "return",
        quantity: 2,
        totalAmount: 300000,
        status: "Hoàn thành",
      },
    ]);

    setDebtRecords([
      {
        id: "1",
        date: "2024-05-01",
        orderCode: "DH240501",
        description: "Bán hàng",
        amount: 2000000,
        amountPaid: 1000000,
        remainingBalance: 1000000,
        notes: "",
      },
      {
        id: "2",
        date: "2024-05-05",
        orderCode: "TT240505",
        description: "Thanh toán",
        amount: -1000000,
        amountPaid: 0,
        remainingBalance: 0,
        notes: "Chuyển khoản ngân hàng",
      },
    ]);

    // Uncomment these when API is ready
    fetchCustomerData();
    // fetchSalesHistory();
    // fetchDebtRecords();
  }, [id]);

  return (
    <React.Fragment>
      <BreadCrumb title="Chi tiết khách hàng" pageTitle="Khách hàng" />

      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={handleBackToList}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-700 dark:bg-zink-700 dark:border-zink-500 dark:text-zink-200 dark:hover:bg-zink-600 dark:hover:text-zink-100 transition-all duration-200"
        >
          <ChevronLeft className="size-4 mr-1" />
          Quay lại danh sách
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <Tab.Container defaultActiveKey="customer-info">
            <Nav className="flex flex-wrap w-full text-sm font-medium text-center border-b border-slate-200 dark:border-zink-500 nav-tabs">
              <Nav.Item eventKey="customer-info" className="group">
                <a
                  href="#!"
                  data-tab-toggle
                  data-target="customer-info"
                  className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:text-custom-500 group-[.active]:border-slate-200 dark:group-[.active]:border-zink-500 group-[.active]:border-b-white dark:group-[.active]:border-b-zink-700 hover:text-custom-500 active:text-custom-500 dark:hover:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                >
                  <span className="align-middle">Thông tin khách hàng</span>
                </a>
              </Nav.Item>
              <Nav.Item eventKey="sales-history" className="group">
                <a
                  href="#!"
                  data-tab-toggle
                  data-target="sales-history"
                  className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:text-custom-500 group-[.active]:border-slate-200 dark:group-[.active]:border-zink-500 group-[.active]:border-b-white dark:group-[.active]:border-b-zink-700 hover:text-custom-500 active:text-custom-500 dark:hover:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                >
                  <span className="align-middle">Lịch sử bán hàng</span>
                </a>
              </Nav.Item>
              <Nav.Item eventKey="outstanding-debt" className="group">
                <a
                  href="#!"
                  data-tab-toggle
                  data-target="outstanding-debt"
                  className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:text-custom-500 group-[.active]:border-slate-200 dark:group-[.active]:border-zink-500 group-[.active]:border-b-white dark:group-[.active]:border-b-zink-700 hover:text-custom-500 active:text-custom-500 dark:hover:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                >
                  <span className="align-middle">Chi tiết công nợ</span>
                </a>
              </Nav.Item>
            </Nav>

            <Tab.Content className="mt-5">
              <Tab.Pane eventKey="customer-info">
                <CustomerInformation customer={customer} />
              </Tab.Pane>

              <Tab.Pane eventKey="sales-history">
                <SalesHistory orders={salesOrders} />
              </Tab.Pane>

              <Tab.Pane eventKey="outstanding-debt">
                <OutstandingDebt
                  debtRecords={debtRecords}
                  totalDebt={customer?.totalDebt || 0}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(CustomerDetail);
