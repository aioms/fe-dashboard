import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { request } from "helpers/axios";
import { IHttpResponse } from "types";
import { ChevronLeft } from "lucide-react";
import withRouter from "Common/withRouter";

// Components
import BreadCrumb from "Common/BreadCrumb";
import Tab from "Common/Components/Tab/Tab";
import { Nav } from "Common/Components/Tab/Nav";
import {
  ReceiptImport,
  ReceiptReturn,
  TransactionTable,
} from "./components/TransactionTable";
import { Product, ProductTable } from "./components/ProductTable";
import {
  Supplier,
  SupplierInformation,
} from "./components/SupplierInformation";

function SupplierDetail(props: any) {
  const { id } = useParams();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [receiptImports, setReceiptImports] = useState<ReceiptImport[]>([]);
  const [receiptReturns, setReceiptReturns] = useState<ReceiptReturn[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [importPage, setImportPage] = useState(1);
  const [returnPage, setReturnPage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  const [hasMoreImports, setHasMoreImports] = useState(true);
  const [hasMoreReturns, setHasMoreReturns] = useState(true);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const handleBackToList = () => {
    props.router.navigate("/suppliers");
  };

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response: IHttpResponse = await request.get(`/suppliers/${id}`);
        if (response.success) {
          setSupplier(response.data);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    const fetchInitialData = async () => {
      try {
        const [importsRes, returnsRes, productsRes] = await Promise.all([
          request.get(
            `/suppliers/${id}/receipt-imports?page=1`
          ) as Promise<IHttpResponse>,
          request.get(
            `/suppliers/${id}/receipt-returns?page=1`
          ) as Promise<IHttpResponse>,
          request.get(
            `/suppliers/${id}/products?page=1`
          ) as Promise<IHttpResponse>,
        ]);

        setReceiptImports(importsRes.data);
        setReceiptReturns(returnsRes.data);
        setProducts(productsRes.data);

        setHasMoreImports(importsRes.metadata?.hasNext);
        setHasMoreReturns(returnsRes.metadata?.hasNext);
        setHasMoreProducts(productsRes.metadata?.hasNext);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchSupplierData();
    fetchInitialData();
  }, [id]);

  const handleLoadMore = async (type: "import" | "return" | "product") => {
    setLoadingMore(true);
    try {
      let response: IHttpResponse;
      switch (type) {
        case "import":
          response = await request.get(
            `/suppliers/${id}/receipt-imports?page=${importPage + 1}`
          );
          setReceiptImports((prev) => [...prev, ...response.data]);
          setImportPage((prev) => prev + 1);
          setHasMoreImports(response.metadata?.hasNext);
          break;
        case "return":
          response = await request.get(
            `/suppliers/${id}/receipt-returns?page=${returnPage + 1}`
          );
          setReceiptReturns((prev) => [...prev, ...response.data]);
          setReturnPage((prev) => prev + 1);
          setHasMoreReturns(response.metadata?.hasNext);
          break;
        case "product":
          response = await request.get(
            `/suppliers/${id}/products?page=${productPage + 1}`
          );
          setProducts((prev) => [...prev, ...response.data]);
          setProductPage((prev) => prev + 1);
          setHasMoreProducts(response.metadata?.hasNext);
          break;
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <React.Fragment>
      <BreadCrumb title="Chi tiết nhà cung cấp" pageTitle="Nhà cung cấp" />

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
          <Tab.Container defaultActiveKey="basic-info">
            <Nav className="flex flex-wrap w-full text-sm font-medium text-center border-b border-slate-200 dark:border-zink-500 nav-tabs">
              <Nav.Item eventKey="basic-info" className="group">
                <a
                  href="#!"
                  data-tab-toggle
                  data-target="basic-info"
                  className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:text-custom-500 group-[.active]:border-slate-200 dark:group-[.active]:border-zink-500 group-[.active]:border-b-white dark:group-[.active]:border-b-zink-700 hover:text-custom-500 active:text-custom-500 dark:hover:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                >
                  <span className="align-middle">Thông tin cơ bản</span>
                </a>{" "}
              </Nav.Item>
              <Nav.Item eventKey="transactions" className="group">
                <a
                  href="#!"
                  data-tab-toggle
                  data-target="transactions"
                  className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:text-custom-500 group-[.active]:border-slate-200 dark:group-[.active]:border-zink-500 group-[.active]:border-b-white dark:group-[.active]:border-b-zink-700 hover:text-custom-500 active:text-custom-500 dark:hover:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                >
                  <span className="align-middle">Công nợ và Giao dịch</span>
                </a>
              </Nav.Item>
              <Nav.Item eventKey="products" className="group">
                <a
                  href="#!"
                  data-tab-toggle
                  data-target="transactions"
                  className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:text-custom-500 group-[.active]:border-slate-200 dark:group-[.active]:border-zink-500 group-[.active]:border-b-white dark:group-[.active]:border-b-zink-700 hover:text-custom-500 active:text-custom-500 dark:hover:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                >
                  <span className="align-middle">Sản phẩm cung cấp</span>
                </a>
              </Nav.Item>
            </Nav>

            <Tab.Content className="mt-5">
              <Tab.Pane eventKey="basic-info">
                <SupplierInformation supplier={supplier} />
              </Tab.Pane>

              <Tab.Pane eventKey="transactions">
                <TransactionTable
                  receiptImports={receiptImports}
                  receiptReturns={receiptReturns}
                  totalDebt={supplier?.totalDebt || 0}
                  onLoadMore={(type) => handleLoadMore(type)}
                  hasMoreImports={hasMoreImports}
                  hasMoreReturns={hasMoreReturns}
                  loadingMore={loadingMore}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="products">
                <ProductTable
                  products={products}
                  onLoadMore={() => handleLoadMore("product")}
                  hasMore={hasMoreProducts}
                  loadingMore={loadingMore}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(SupplierDetail);
