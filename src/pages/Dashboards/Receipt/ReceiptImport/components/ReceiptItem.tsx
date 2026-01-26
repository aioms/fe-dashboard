import { Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";

import { Counter } from "Common/Components/Counter";
import { formatMoney, parseCurrencyInput } from "helpers/utils";

type Props = {
  index: number;
  item: any;
  onRemove: (id: string) => void;
  onUpdate: (data: any) => void;
}

export const ReceiptItem: FC<Props> = ({ item, index, onRemove, onUpdate }) => {
  const [quantity, setQuantity] = useState(1);
  const [formattedCostPrice, setformattedCostPrice] = useState<string>(
    formatMoney(item.price)
  );
  const [newCostPrice, setNewCostPrice] = useState<number>(item.price);
  const [newDiscount, setNewDiscount] = useState<number>(item.discount);

  const handleCostPriceChange = (value: string | null | undefined) => {
    if (value !== null && value !== undefined) {
      const numericValue = parseCurrencyInput(value);
      if (numericValue >= 0) {
        setNewCostPrice(numericValue);
        setformattedCostPrice(formatMoney(numericValue));
      }
    }
  };

  const handleDiscountChange = (value: number | null) => {
    if (value !== null && value >= 0 && value <= 100) {
      setNewDiscount(value);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
    }
  };

  useEffect(() => {
    if (typeof newCostPrice === "number" && typeof newDiscount === "number") {
      if (typeof quantity === "number") {
        const totalPrice = quantity * newCostPrice * (1 - newDiscount / 100);

        onUpdate?.({
          ...item,
          quantity,
          price: newCostPrice,
          discount: newDiscount,
          totalPrice,
        });
      }
    }
  }, [newCostPrice, newDiscount, quantity, item, onUpdate]);

  return (
    <>
      <tr>
        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
          {index + 1}
        </td>
        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
          {item.code}
        </td>
        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
          <h6 className="mb-1 text-wrap">{item.name}</h6>
        </td>
        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
          <Counter
            name="quantity"
            initialValue={item.quantity}
            onCountChange={(value) => {
              handleQuantityChange(value);
            }}
          />
        </td>
        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
          <input
            type="number"
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
            placeholder="Chiết khấu"
            value={newDiscount}
            min={0}
            max={100}
            onChange={(e) => {
              handleDiscountChange(+e.target.value);
            }}
          />
        </td>
        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
          <input
            type="text"
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
            placeholder="Giá nhập"
            value={formattedCostPrice}
            onChange={(e) => {
              handleCostPriceChange(e.target.value);
            }}
          />
        </td>
        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
          <button
            type="button"
            className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 dark:bg-zink-600 dark:text-zink-200 text-slate-500 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 />
          </button>
        </td>
      </tr>
    </>
  )
};