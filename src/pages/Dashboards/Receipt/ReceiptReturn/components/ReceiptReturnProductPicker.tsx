import ProductListReceiptModal from "../../components/ProductListReceiptModal";
import type useReceiptReturnUpdate from "../hooks/useReceiptReturnUpdate";

type Props = Pick<
  ReturnType<typeof useReceiptReturnUpdate>,
  "productListModal" | "rows" | "productListModalToggle" | "setRows"
>;
export default function ReceiptReturnProductPicker({ productListModal, rows, productListModalToggle, setRows }: Props) {
  return (
    <ProductListReceiptModal
      show={productListModal}
      selectedItems={rows}
      onCancel={productListModalToggle}
      onDone={(selectedProducts) => {
        if (!selectedProducts.length) return;

        setRows((prev) => {
          const newProducts = selectedProducts.map((item: any) => {
            const row = prev.find((row) => row.id === item.id);
            console.log({ item, row });

            if (row) return row;

            return {
              id: item.id,
              productCode: item.productCode,
              code: item.code,
              name: item.name,
              quantity: 1,
              price: item.price,
              inventory: item.inventory,
            };
          });

          return [...newProducts];
        });
      }}
    />
  );
}
