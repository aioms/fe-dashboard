import Barcode from "react-barcode";
import { Mail, PackageOpen, UserX2 } from "lucide-react";
import { formatMoneyWithVND } from "helpers/utils";
interface Props {
  rows: Array<unknown>;
  totalAmount: number;
  quantity: number;
  receiptInfo: { receiptNumber?: string };
}
export default function ReceiptReturnTotals({ rows, totalAmount, quantity, receiptInfo }: Props) {
  return (
    <div className="xl:col-span-3">
      <div className="card sticky top-[calc(theme('spacing.header')_*_1.3)]">
        <div className="card-body">
          <h6 className="mb-4 text-15">Thông tin chung</h6>

          <div className="px-5 py-8 flex justify-center rounded-md bg-sky-50 dark:bg-zink-600">
            {receiptInfo.receiptNumber && (
              <Barcode
                value={receiptInfo.receiptNumber}
                format="CODE128"
                width={2}
                height={100}
                displayValue={true}
              />
            )}
          </div>

          <div className="mt-3">
            <ul className="flex flex-col gap-5">
              <li className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 text-red-500 bg-red-100 rounded-md dark:bg-red-500/20 shrink-0">
                  <Mail className="size-4"></Mail>
                </div>
                <h6 className="grow">Tổng số lượng</h6>
                <p className="text-slate-500 dark:text-zink-200">
                  {quantity}
                </p>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-md text-sky-500 bg-sky-100 dark:bg-sky-500/20 shrink-0">
                  <PackageOpen className="size-4"></PackageOpen>
                </div>
                <h6 className="grow">Tổng số mặt hàng</h6>
                <p className="text-slate-500 dark:text-zink-200">
                  {rows.length}
                </p>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 text-orange-500 bg-orange-100 rounded-md dark:bg-orange-500/20 shrink-0">
                  <UserX2 className="size-4"></UserX2>
                </div>
                <h6 className="grow">Tổng tiền hàng</h6>
                <p className="text-slate-500 dark:text-zink-200">
                  {formatMoneyWithVND(totalAmount)}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
