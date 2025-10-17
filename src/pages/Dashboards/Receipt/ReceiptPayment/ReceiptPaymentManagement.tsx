import React, { useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import { CreditCard, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import ReceiptPaymentList from "./components/ReceiptPaymentList";
import ReceiptDebtList from "./components/ReceiptDebtList";

const ReceiptPaymentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"payment" | "debt">("payment");

  const toggleTab = (tab: "payment" | "debt") => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <BreadCrumb title="Quản lý phiếu chi" pageTitle="Phiếu chi" />
      
      <div className="card">
        <div className="card-body">
          {/* Tab Navigation */}
          <ul className="flex flex-wrap w-full text-sm font-medium text-center text-gray-500 nav-tabs">
            <li className={`group ${activeTab === "payment" && "active"}`}>
              <Link
                to="#"
                className="inline-block px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                onClick={() => toggleTab("payment")}
              >
                <CreditCard className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
                <span className="align-middle">Danh sách phiếu chi</span>
              </Link>
            </li>
            <li className={`group ${activeTab === "debt" && "active"}`}>
              <Link
                to="#"
                className="inline-block px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                onClick={() => toggleTab("debt")}
              >
                <Receipt className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
                <span className="align-middle">Danh sách phiếu thu</span>
              </Link>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="mt-5">
            {activeTab === "payment" && <ReceiptPaymentList />}
            {activeTab === "debt" && <ReceiptDebtList />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReceiptPaymentManagement;