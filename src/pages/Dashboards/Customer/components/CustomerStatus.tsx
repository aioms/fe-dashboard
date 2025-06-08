import { CUSTOMER_STATUS } from "Common/constants/customer-constant";
import { FC } from "react";

type Props = {
  status: CUSTOMER_STATUS;
}

export const CustomerStatusBadge: FC<Props> = ({ status }) => {
  switch (status) {
    case CUSTOMER_STATUS.ACTIVE:
      return (
        <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent inline-flex items-center status">
          Hoạt động
        </span>
      );
    case CUSTOMER_STATUS.INACTIVE:
      return (
        <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-slate-100 border-transparent text-slate-500 dark:bg-slate-500/20 dark:text-zink-200 dark:border-transparent status">
          Không hoạt động
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-gray-100 border-transparent text-gray-500 dark:bg-gray-500/20 dark:text-zink-200 dark:border-transparent status">
          {status}
        </span>
      );
  }
};