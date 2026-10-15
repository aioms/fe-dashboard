import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
import { AlertTriangle, RefreshCw } from "lucide-react";

import BreadCrumb from "Common/BreadCrumb";
import DeleteModal from "Common/DeleteModal";
import {
  getAiConnectionsThunk,
  revokeAiConnectionThunk,
} from "slices/thunk";
import type { RootState } from "slices";
import type { IAiConnection } from "types/ai-connection";

import ConnectionGuide from "./components/ConnectionGuide";
import ConnectionTable from "./components/ConnectionTable";

type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;

const AiConnectionList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { connections, status, error, revokingId } = useSelector(
    (state: RootState) => state.AiConnection
  );
  const [pendingRevoke, setPendingRevoke] = useState<IAiConnection | null>(
    null
  );

  const fetchConnections = useCallback(() => {
    dispatch(getAiConnectionsThunk());
  }, [dispatch]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleConfirmRevoke = () => {
    if (!pendingRevoke) return;
    dispatch(revokeAiConnectionThunk(pendingRevoke.id));
    setPendingRevoke(null);
  };

  const renderBody = () => {
    if (status === "idle" || (status === "loading" && connections.length === 0)) {
      return (
        <div className="py-10 text-center text-slate-500 dark:text-zink-200">
          {t("aiConnection.loading", { defaultValue: "Đang tải..." })}
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="py-10 text-center">
          <AlertTriangle className="size-6 mx-auto text-red-500" />
          <h5 className="mt-2 mb-1">
            {t("aiConnection.errorTitle", {
              defaultValue: "Không thể tải danh sách kết nối",
            })}
          </h5>
          <p className="mb-4 text-slate-500 dark:text-zink-200">{error}</p>
          <button
            type="button"
            onClick={fetchConnections}
            className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600"
          >
            <RefreshCw className="inline-block size-4" />{" "}
            <span className="align-middle">
              {t("aiConnection.retry", { defaultValue: "Thử lại" })}
            </span>
          </button>
        </div>
      );
    }

    if (connections.length === 0) {
      return <ConnectionGuide />;
    }

    return (
      <ConnectionTable
        connections={connections}
        revokingId={revokingId}
        onRevoke={setPendingRevoke}
      />
    );
  };

  return (
    <React.Fragment>
      <BreadCrumb
        title={t("aiConnection.title", { defaultValue: "Kết nối AI" })}
        pageTitle="AI Connections"
      />
      <DeleteModal
        show={pendingRevoke !== null}
        onHide={() => setPendingRevoke(null)}
        onDelete={handleConfirmRevoke}
        title={t("aiConnection.revokeTitle", {
          defaultValue: "Thu hồi kết nối?",
        })}
        message={t("aiConnection.revokeMessage", {
          defaultValue:
            "Ứng dụng này sẽ không truy cập được dữ liệu AIOM nữa.",
        })}
        confirmText={t("aiConnection.revoke", { defaultValue: "Thu hồi" })}
      />
      <div className="card">
        <div className="card-body">
          <h6 className="mb-1 text-15">
            {t("aiConnection.heading", {
              defaultValue: "Ứng dụng AI được phép đọc dữ liệu AIOM",
            })}
          </h6>
          <p className="mb-4 text-slate-500 dark:text-zink-200">
            {t("aiConnection.description", {
              defaultValue:
                "Các ứng dụng như ChatGPT, Claude bạn đã cấp quyền chỉ đọc. Thu hồi bất cứ lúc nào.",
            })}
          </p>
          {renderBody()}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AiConnectionList;
