import React, { useEffect, useState } from "react";
import Modal from "Common/Components/Modal";
import { Loader2, Printer } from "lucide-react";
import Barcode from "react-barcode";
import { formatMoney } from "helpers/utils";
import { Counter } from "Common/Components/Counter";

interface props {
  receiptItems: any[];
  show: boolean;
  onClose?: () => void;
}

const PrintMultipleBarcodeModal: React.FC<props> = ({
  show,
  receiptItems,
  onClose,
}) => {
  const [isButtonLoading] = useState(false);
  const [products, setProducts] = useState<any>([]);

  const handlePrint = () => window.print();

  useEffect(() => {
    if (receiptItems.length === 0) {
      return;
    }

    const products = receiptItems.map((product) => ({
      code: product.productCode,
      name: product.productName,
      price: formatMoney(product.costPrice),
      quantity: product.quantity,
    }));

    setProducts(products);
  }, [receiptItems]);

  return (
    <React.Fragment>
      <Modal
        show={show}
        onHide={onClose}
        id="extraLargeModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen lg:w-[55rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500 dark:text-zink-200 dark:hover:text-red-500"
        >
          <Modal.Title className="text-16">In tem mã hàng hóa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="ltr:text-left rtl:text-right ">
                <tr className="">
                  <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                    Mã sản phẩm
                  </th>
                  <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                    Tên
                  </th>
                  <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                    Giá nhập
                  </th>
                  <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                    Số lượng
                  </th>
                </tr>
              </thead>
              <tbody>
                {receiptItems.map((product) => (
                  <tr
                    key={product.id}
                    className="odd:bg-slate-50 even:bg-white dark:odd:bg-zink-600 dark:even:bg-zink-700"
                  >
                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                      <a
                        href="#!"
                        className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600"
                      >
                        {product.code}
                      </a>
                    </td>
                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                      {product.productName}
                    </td>
                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                      {formatMoney(product.costPrice)}
                    </td>
                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                      <Counter
                        name="quantity"
                        initialValue={product.quantity}
                        onCountChange={(value) => {
                          setProducts((prev: any[]) => {
                            const newProducts = [...prev];

                            newProducts.forEach((p) => {
                              if (p.code === product.productCode) {
                                p.quantity = value;
                              }
                            });

                            return newProducts;
                          });
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-end p-4 mt-auto border-t border-slate-200 dark:border-zink-500">
          <button
            type="button"
            className="mr-2 flex items-center text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
            onClick={handlePrint}
          >
            {isButtonLoading ? (
              <Loader2 className="size-4 ltr:mr-2 rtl:ml-2 animate-spin" />
            ) : (
              <>
                <Printer size={20} className="mr-2" />
                In mã tem
              </>
            )}
          </button>
        </Modal.Footer>
      </Modal>
      <div className="print-only">
        <div className={`flex justify-start flex-wrap`}>
          {products.map((product: any, index: number) =>
            Array(product.quantity)
              .fill(0)
              .map((_, i) => (
                <div key={`${index}-${i}`} className="p-2 grid justify-items-center">
                  <div className="text-sm">{product.name}</div>
                  <Barcode
                    value={product.code}
                    width={2}
                    height={30}
                    fontSize={10}
                    marginLeft={10}
                  />
                  <div className="text-sm mt-1">
                    {formatMoney(product.price)} VND
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PrintMultipleBarcodeModal;
