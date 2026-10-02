import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import useReceiptReturnUpdate from "./hooks/useReceiptReturnUpdate";
import ReceiptReturnUpdateView from "./components/ReceiptReturnUpdateView";
import DebtReturnReview from "./components/DebtReturnReview";

export default function ReceiptReturnUpdate() {
  const form = useReceiptReturnUpdate();
  const { t } = useTranslation();
  if (!form.receiptId) return <Navigate to="/receipt-return/list" />;
  if (form.loadState.id !== form.receiptId || form.loadState.status === "loading") return <div className="card p-4">{t("debtReturn.loading")}</div>;
  if (form.loadState.status === "error") return <div className="card p-4" role="alert"><p>{t("debtReturn.error")}</p><button className="btn bg-custom-500 text-white" onClick={() => void form.loadReceipt()}>{t("debtReturn.retry")}</button></div>;
  if (form.loadState.status === "empty") return <div className="card p-4"><p>{t("debtReturn.notFound")}</p><Link to="/receipt-return/list">{t("debtReturn.back")}</Link></div>;
  if (form.receiptInfo.refType === "debt" && form.receiptInfo.accountingVersion === 3) {
    return <DebtReturnReview key={form.receiptId} receipt={form.receiptInfo} items={form.rows} receiptId={form.receiptId} />;
  }
  return <ReceiptReturnUpdateView {...form} />;
}
