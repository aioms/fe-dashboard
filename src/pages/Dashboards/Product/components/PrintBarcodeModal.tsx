import React, { useMemo, useState, useEffect } from "react";
import Modal from "Common/Components/Modal";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { Counter } from "Common/Components/Counter";
import { Printer } from "lucide-react";

interface props {
  show: boolean;
  barcode?: string;
  productName?: string;
  onClose?: () => void;
}

const PrintBarcodeModal: React.FC<props> = ({ show, barcode, productName, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const barcodeRef = React.useRef<HTMLDivElement>(null);

  // Configure print settings for label printer
  const handlePrint = useReactToPrint({
    contentRef: barcodeRef,
    ignoreGlobalStyles: false,
    // size: 35mm 22mm portrait;
    pageStyle: `
      @media print {
        @page {
          margin: 0;
        }
        html, body {
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        body * {
          visibility: hidden;
          display: none;
        }

        .print-only,
        .print-only * {
          visibility: visible;
          display: block;
        }
        .barcode-container {
          margin: 0;
          padding: 0;
        }
        .barcode-row {
          display: flex;
          justify-content: flex-start;
          page-break-after: always;
        }
        .barcode-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2mm !important;
          padding-left: 0 !important;
        }
        .product-name {
          font-size: 4pt !important;
          text-align: center;
          word-break: break-word;
        }
      }
    `,
  });

  // Fix scroll issue when modal closes
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  const barcodes = useMemo(() => {
    if (!barcode) {
      return null;
    }

    const barcodeItems = Array.from(
      { length: quantity },
      (_, idx) => `${idx}-${barcode}`
    );

    // Group barcodes into pairs for 2-column layout
    const rows = [];
    for (let i = 0; i < barcodeItems.length; i += 2) {
      const row = (
        <div key={`row-${i}`} className="barcode-row">
          <div className="barcode-item">
            {productName && (
              <div className="text-pretty product-name">{productName}</div>
            )}
            <Barcode
              value={barcode}
              format="CODE128"
              width={1}
              height={20}
              // margin={2}
              fontSize={7}
              background="#ffffff"
              lineColor="#000000"
              textAlign="center"
              textPosition="bottom"
            />
          </div>
          {i + 1 < barcodeItems.length && (
            <div className="barcode-item">
              {productName && (
                <div className="text-pretty product-name">{productName}</div>
              )}
              <Barcode
                value={barcode}
                format="CODE128"
                width={1}
                height={20}
                // margin={2}
                fontSize={7}
                background="#ffffff"
                lineColor="#000000"
                textAlign="center"
                textPosition="bottom"
              />
            </div>
          )}
        </div>
      );
      rows.push(row);
    }

    return rows;
  }, [quantity, barcode, productName]);

  if (!barcode) {
    return null;
  }

  const handleModalClose = () => {
    // Ensure scroll is restored before closing
    document.body.style.overflow = "auto";
    if (onClose) onClose();
  };

  return (
    <React.Fragment>
      <Modal
        show={show}
        onHide={handleModalClose}
        id="printBarcodeModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[20rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500 dark:text-zink-200 dark:hover:text-red-500"
        >
          <Modal.Title className="text-16">Tem mã hàng hóa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
          <div className="flex flex-col items-center justify-center">
            {productName && (
              <div className="text-center mb-2 font-medium">{productName}</div>
            )}
            <Barcode
              value={barcode}
              format="CODE128"
              width={2}
              height={100}
              displayValue={true}
              marginBottom={20}
            />

            <Counter
              name="quantity"
              initialValue={quantity}
              onCountChange={(value) => setQuantity(value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-end p-4 mt-auto border-t border-slate-200 dark:border-zink-500">
          <button
            type="button"
            className="mr-2 flex items-center text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
            onClick={() => handlePrint()}
          >
            <Printer size={20} className="mr-2" />
            In mã tem
          </button>
        </Modal.Footer>
      </Modal>

      <div className="print-only" ref={barcodeRef}>
        <div className="barcode-container">{barcodes}</div>
      </div>
    </React.Fragment>
  );
};

export default PrintBarcodeModal;
