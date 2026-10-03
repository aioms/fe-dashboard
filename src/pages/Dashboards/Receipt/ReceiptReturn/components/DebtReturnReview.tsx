import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getReceiptReturnInfo, updateDebtReturn } from "slices/receipt-return/thunk";
import type { DebtReturnReceipt } from "types/debt-return";
import { formatMoneyWithVND } from "helpers/utils";

interface Props {
  receipt: DebtReturnReceipt;
  receiptId: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
}

export default function DebtReturnReview({ receipt, receiptId, items }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(receipt.status);
  const [note, setNote] = useState(receipt.note || "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const immutable = receipt.operationType === "exchange" && receipt.status === "completed";

  const submit = async () => {
    if (pending || immutable) return;
    if (note.length > 500) {
      setError(t("debtReturn.invalidNote"));
      return;
    }
    if (receipt.status === "completed" && status !== "completed" && !window.confirm(t("debtReturn.cancelConfirm"))) {
      return;
    }
    setPending(true);
    setError("");
    try {
      // Existing store lacks a typed dispatch export; infer dispatch capability from the thunk.
      const action = updateDebtReturn({ id: receiptId, status, note });
      await (dispatch as (thunk: typeof action) => ReturnType<typeof action>)(action).unwrap();
      const reload = getReceiptReturnInfo(receiptId);
      (dispatch as (thunk: typeof reload) => ReturnType<typeof reload>)(reload);
      toast.success(t("debtReturn.saved"));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : t("debtReturn.error"));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body space-y-4">
        <h1 data-cy="debt-return-review" className="text-lg font-semibold">{t("debtReturn.title")} {receipt.receiptNumber}</h1>
        <p>{t("debtReturn.source")}: {receipt.refId}</p>
        <p className="text-sm text-slate-500">{t("debtReturn.noCash")}</p>
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name} × {item.quantity} — {formatMoneyWithVND(item.quantity * item.price)}</li>
          ))}
        </ul>
        <div>{t("debtReturn.returnAmount")}: {formatMoneyWithVND(receipt.originalReturnAmount)}</div>
        <div>{t("debtReturn.replacementAmount")}: {formatMoneyWithVND(receipt.replacementAmount)}</div>
        <div>{t("debtReturn.difference")}: {formatMoneyWithVND(receipt.differenceAmount)}</div>
        <h2>{t("debtReturn.received")}</h2>
        {receipt.exchangeItems?.length
          ? (
            <ul>
              {receipt.exchangeItems.map((item) => (
                <li key={item.productId}>
                  {item.productName} × {item.quantity} — {formatMoneyWithVND(item.unitPrice)}
                </li>
              ))}
            </ul>
          )
          : <p>{t("debtReturn.empty")}</p>}
        {immutable ? <p>{t("debtReturn.immutable")}</p> : (
          <>
            <label className="block">
              {t("debtReturn.status")}
              <select
                data-cy="debt-return-status"
                disabled={pending}
                className="form-input"
                value={status}
                onChange={(event) => setStatus(event.target.value as DebtReturnReceipt["status"])}
              >
                {(["draft", "processing", "completed", "cancelled"] as const).map((value) => (
                  <option value={value} key={value}>{t(`debtReturn.${value}`)}</option>
                ))}
              </select>
            </label>
            <label className="block">
              {t("debtReturn.note")}
              <textarea
                disabled={pending}
                className="form-input"
                value={note}
                maxLength={500}
                onChange={(event) => setNote(event.target.value)}
              />
            </label>
            {error && <p role="alert" className="text-red-500">{error}</p>}
            <button data-cy="debt-return-save" disabled={pending} type="button" className="btn bg-custom-500 text-white" onClick={submit}>
              {error ? t("debtReturn.retry") : t("debtReturn.save")}
            </button>
          </>
        )}
        <Link className="block" to="/receipt-return/list">{t("debtReturn.back")}</Link>
      </div>
    </div>
  );
}
