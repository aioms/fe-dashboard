import DmsgDocuments from "./DmsgDocuments";
import { useTranslation } from "react-i18next";
import { formatMoney } from "helpers/utils";
import type { DmsgOrderDetail as Detail } from "types/dmsg";

export default function DmsgOrderDetail({ order, onBack }: { order: Detail; onBack: () => void }) {
  const { t } = useTranslation();
  const fields = [
    ["DMSG invoice", order.dmsg.invoiceTotal], ["DMSG before VAT", order.dmsg.beforeVat],
    ["DMSG VAT", order.dmsg.vatAmount], ["DMSG revenue", order.dmsg.revenue],
    ["DMSG customer transfer", order.dmsg.customerTransfer], ["DMSG cost", order.dmsg.totalCost],
    ["DMSG fee", order.dmsg.invoiceFee], ["DMSG profit", order.dmsg.profit],
    ["DMSG received", order.dmsgSettlements?.netReceived || 0],
    ["DMSG transferred", order.dmsgSettlements?.customerTransferred || 0],
  ] as const;
  return <div className="space-y-4" data-cy="dashboard-dmsg-detail">
    <div className="card"><div className="card-body"><button className="btn border mb-3" onClick={onBack}>{t("DMSG back")}</button><h1 className="text-xl font-bold">{t("DMSG title")} · {order.code}</h1><p className="mt-2">{t("DMSG status")}: {order.status}</p><p className="mt-2 text-slate-500">{t(order.status === "draft" ? "DMSG draft hint" : order.status === "cancelled" ? "DMSG cancelled hint" : "DMSG completed hint")}</p></div></div>
    <div className="card"><div className="card-body grid gap-4 md:grid-cols-2">{fields.map(([key, value]) => <div key={key} className="flex justify-between gap-4 border-b py-3"><span>{t(key)}</span><strong>{formatMoney(value)}</strong></div>)}</div></div>
    <div className="card"><div className="card-body"><h2 className="font-bold mb-3">{t("DMSG goods")}</h2>{order.items.map((item) => <div key={item.productId} className="flex justify-between gap-4 border-b py-3"><span>{item.productName}</span><strong>{item.quantity}</strong></div>)}</div></div>
    <div className="card"><div className="card-body">{t("DMSG profit margin")}: {order.dmsg.revenue > 0 ? (order.dmsg.profit / order.dmsg.revenue * 100).toFixed(2) + "%" : "—"}</div></div>
    <DmsgDocuments id={order.id} files={order.attachments || []} />
    <p className="text-sm text-slate-500">{t("DMSG mobile editing")}</p>
  </div>;
}
