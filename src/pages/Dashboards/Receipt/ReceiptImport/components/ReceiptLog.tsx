import { getDate } from "helpers/date";
import { FC } from "react";
import { ReceiptStatus } from "./ReceiptStatus";

interface StatusChangeLog {
  timestamp: string;
  oldStatus: string;
  newStatus: string;
  user: string;
}

type Props = {
  receipt: {
    changeLog: StatusChangeLog[];
  };
};

export const ReceiptLog: FC<Props> = ({ receipt }) => {
  if (!receipt?.changeLog?.length) {
    return (
      <div className="text-gray-500 text-center py-4">
        Không có lịch sử thay đổi
      </div>
    );
  }

  return (
    <>
      <div className="flow-root">
        <ul className="-mb-8">
          {receipt.changeLog.map((log, idx) => (
            <li key={log.timestamp}>
              <div className="relative pb-8">
                {idx !== receipt.changeLog.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <svg
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a7 7 0 100 14 7 7 0 000-14zm-1 10.707l-3-3a1 1 0 011.414-1.414L9 10.586l3.793-3.793a1 1 0 011.414 1.414l-4.5 4.5a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Trạng thái thay đổi từ{" "}
                        <ReceiptStatus item={log.oldStatus} />{" "}
                        thành{" "}
                        <ReceiptStatus item={log.newStatus} />{" "}
                      </p>
                      <p className="text-xs text-gray-500">bởi {log.user}</p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {getDate(log.timestamp).format("HH:mm DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
