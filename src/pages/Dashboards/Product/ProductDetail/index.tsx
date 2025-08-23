import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronLeft } from "lucide-react";

import { request } from "helpers/axios";
import { IHttpResponse } from "types";
import withRouter from "Common/withRouter";

// Components
import BreadCrumb from "Common/BreadCrumb";
import Tab from "Common/Components/Tab/Tab";
import { Nav } from "Common/Components/Tab/Nav";
import ProductInformation from "./components/ProductInformation";
import InventoryHistory from "./components/InventoryHistory";
import SupplierInfo from "./components/SupplierInfo";

// Types
import type { IProduct, IInventoryRecord } from "./index.d";

function ProductDetail(props: any) {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [inventoryHistory, setInventoryHistory] = useState<IInventoryRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackToList = () => {
    props.router.navigate("/products");
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const response: IHttpResponse = await request.get(`/products/${id}`);
        if (response.success) {
          setProduct(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch product data");
        }

        // Fetch inventory history
        try {
          const inventoryResponse: IHttpResponse = await request.get(
            `/products/${id}/inventory-history`
          );
          if (inventoryResponse.success) {
            setInventoryHistory(inventoryResponse.data);
          }
        } catch (inventoryError: any) {
          console.warn(
            "Failed to fetch inventory history:",
            inventoryError.message
          );
        }
      } catch (error: any) {
        console.error("Error fetching product data:", error);
        setError(error.message || "Failed to load product information");
        toast.error(error.message || "Failed to load product information");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <React.Fragment>
        <BreadCrumb title="Chi tiết sản phẩm" pageTitle="Sản phẩm" />
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-500">Đang tải thông tin sản phẩm...</div>
        </div>
      </React.Fragment>
    );
  }

  if (error) {
    return (
      <React.Fragment>
        <BreadCrumb title="Chi tiết sản phẩm" pageTitle="Sản phẩm" />
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
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-red-500 text-lg font-medium mb-2">
                Lỗi tải dữ liệu
              </div>
              <div className="text-slate-500 text-center">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-custom-500 text-white rounded-md hover:bg-custom-600 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <BreadCrumb title="Chi tiết sản phẩm" pageTitle="Sản phẩm" />

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
          <Tab.Container defaultActiveKey="product-info">
            <Nav className="flex flex-wrap w-full text-sm font-medium text-center border-b border-slate-200 dark:border-zink-500 nav-tabs">
              <Nav.Item eventKey="product-info" className="group">
                <a
                  href="#!"
                  data-tab-toggle
                  data-target="product-info"
                  className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:text-custom-500 group-[.active]:border-slate-200 dark:group-[.active]:border-zink-500 group-[.active]:border-b-white dark:group-[.active]:border-b-zink-700 hover:text-custom-500 active:text-custom-500 dark:hover:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                >
                  <span className="align-middle">Thông tin sản phẩm</span>
                </a>
              </Nav.Item>
              <Nav.Item eventKey="inventory-history" className="group">
                <a
                  href="#!"
                  data-tab-toggle
                  data-target="inventory-history"
                  className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:text-custom-500 group-[.active]:border-slate-200 dark:group-[.active]:border-zink-500 group-[.active]:border-b-white dark:group-[.active]:border-b-zink-700 hover:text-custom-500 active:text-custom-500 dark:hover:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                >
                  <span className="align-middle">Lịch sử tồn kho</span>
                </a>
              </Nav.Item>
              <Nav.Item eventKey="supplier-info" className="group">
                <a
                  href="#!"
                  data-tab-toggle
                  data-target="supplier-info"
                  className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:text-custom-500 group-[.active]:border-slate-200 dark:group-[.active]:border-zink-500 group-[.active]:border-b-white dark:group-[.active]:border-b-zink-700 hover:text-custom-500 active:text-custom-500 dark:hover:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                >
                  <span className="align-middle">Thông tin nhà cung cấp</span>
                </a>
              </Nav.Item>
            </Nav>

            <Tab.Content className="mt-5">
              <Tab.Pane eventKey="product-info">
                <ProductInformation product={product} />
              </Tab.Pane>

              <Tab.Pane eventKey="inventory-history">
                <InventoryHistory records={inventoryHistory} />
              </Tab.Pane>

              <Tab.Pane eventKey="supplier-info">
                <SupplierInfo suppliers={product?.suppliers || []} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(ProductDetail);
