import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

import { getDate } from "helpers/date";
import type { IAiConnection } from "types/ai-connection";

interface Props {
  connections: IAiConnection[];
  revokingId: string | null;
  onRevoke: (connection: IAiConnection) => void;
}

const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const formatDateTime = (value: string) =>
  getDate(value).tz("Asia/Ho_Chi_Minh").format(DATE_TIME_FORMAT);

const ConnectionTable: React.FC<Props> = ({
  connections,
  revokingId,
  onRevoke,
}) => {
  const { t } = useTranslation();
  const headerClass =
    "px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold text-left border-y border-slate-200 dark:border-zink-500";
  const cellClass =
    "px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500";

  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead className="bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200">
          <tr>
            <th className={headerClass}>
              {t("aiConnection.colApp", { defaultValue: "Ứng dụng" })}
            </th>
            <th className={headerClass}>
              {t("aiConnection.colScope", { defaultValue: "Quyền truy cập" })}
            </th>
            <th className={headerClass}>
              {t("aiConnection.colConnectedAt", { defaultValue: "Kết nối lúc" })}
            </th>
            <th className={headerClass}>
              {t("aiConnection.colLastUsed", { defaultValue: "Dùng lần cuối" })}
            </th>
            <th className={headerClass}>
              {t("aiConnection.colAction", { defaultValue: "Thao tác" })}
            </th>
          </tr>
        </thead>
        <tbody>
          {connections.map((connection) => (
            <tr key={connection.id}>
              <td className={cellClass}>
                <h6 className="mb-0.5">{connection.clientName}</h6>
                <p className="mb-0 text-slate-500 dark:text-zink-200">
                  {connection.clientHost}
                </p>
              </td>
              <td className={cellClass}>
                {t("aiConnection.scopeReadOnly", {
                  defaultValue: "Chỉ đọc dữ liệu",
                })}
              </td>
              <td className={cellClass}>{formatDateTime(connection.createdAt)}</td>
              <td className={cellClass}>
                {connection.lastUsedAt
                  ? formatDateTime(connection.lastUsedAt)
                  : t("aiConnection.neverUsed", { defaultValue: "Chưa dùng" })}
              </td>
              <td className={cellClass}>
                <button
                  type="button"
                  disabled={revokingId === connection.id}
                  onClick={() => onRevoke(connection)}
                  className="text-red-500 bg-red-100 btn hover:text-white hover:bg-red-500 focus:text-white focus:bg-red-500 dark:bg-red-500/20 dark:hover:bg-red-500 disabled:opacity-60"
                >
                  <Trash2 className="inline-block size-4" />{" "}
                  <span className="align-middle">
                    {t("aiConnection.revoke", { defaultValue: "Thu hồi" })}
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConnectionTable;
