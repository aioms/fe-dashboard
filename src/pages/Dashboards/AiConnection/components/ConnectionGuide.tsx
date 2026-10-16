import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Copy, PlugZap } from "lucide-react";
import { toast } from "react-toastify";

export const MCP_URL = "https://aiom-api.secmind.work/mcp";

const ConnectionGuide: React.FC = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(
        t("aiConnection.copyError", { defaultValue: "Không thể sao chép liên kết" }),
        { autoClose: 2000 }
      );
    }
  };

  return (
    <div className="py-8 text-center">
      <PlugZap className="size-8 mx-auto text-sky-500" />
      <h5 className="mt-3 mb-1">
        {t("aiConnection.emptyTitle", {
          defaultValue: "Chưa có ứng dụng AI nào được kết nối",
        })}
      </h5>
      <p className="max-w-xl mx-auto mb-4 text-slate-500 dark:text-zink-200">
        {t("aiConnection.emptyGuide", {
          defaultValue:
            "Để kết nối, vào Settings > Connectors trong Claude hoặc Plugins trong ChatGPT, rồi thêm kết nối mới với địa chỉ MCP bên dưới và đăng nhập AIOM khi được hỏi.",
        })}
      </p>
      <div className="flex items-center justify-center max-w-xl gap-2 mx-auto">
        <input
          type="text"
          readOnly
          value={MCP_URL}
          aria-label={t("aiConnection.mcpUrl", { defaultValue: "Địa chỉ MCP" })}
          className="form-input grow"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
        >
          {copied ? (
            <Check className="inline-block size-4" />
          ) : (
            <Copy className="inline-block size-4" />
          )}{" "}
          <span className="align-middle">
            {copied
              ? t("aiConnection.copied", { defaultValue: "Đã sao chép" })
              : t("aiConnection.copy", { defaultValue: "Sao chép" })}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ConnectionGuide;
