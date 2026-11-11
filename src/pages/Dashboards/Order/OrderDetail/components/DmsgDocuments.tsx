import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getDmsgFileThunk } from "slices/order/thunk";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

export default function DmsgDocuments({ id, files }: { id: string; files: Array<{ fileId: string; kind: string }> }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, UnknownAction>>();
  const [error, setError] = useState(""), [busy, setBusy] = useState(false);
  async function open(fileId: string) {
    setBusy(true); setError("");
    const tab = window.open("about:blank", "_blank");
    try {
      const file = await dispatch(getDmsgFileThunk({ id, fileId })).unwrap();
      if (tab) { tab.opener = null; tab.location.href = file.url; }
      else window.location.assign(file.url);
    } catch { tab?.close(); setError(t("DMSG file error")); }
    finally { setBusy(false); }
  }
  return <div className="card"><div className="card-body"><h2 className="font-bold">{t("DMSG documents")}</h2>
    {!files.length && <p>{t("DMSG no documents")}</p>}
    {files.map((file, index) => <button className="btn border m-2" disabled={busy} key={file.fileId} onClick={() => void open(file.fileId)}>{t(file.kind === "cost_image" ? "DMSG cost image" : "DMSG invoice PDF")} {index + 1}</button>)}
    {error && <p role="alert">{error}</p>}
  </div></div>;
}
