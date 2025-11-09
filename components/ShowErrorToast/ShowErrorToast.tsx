import { toast } from "react-toastify";
import "../ShowErrorToast/ShowErrorToast.module.css";

export function showErrorToast(message: string) {
  toast.error(message, {
    className: "custom-error-toast",
    progressClassName: "custom-error-progress",
    icon: <span>🚫</span>,
    position: "top-right",
    autoClose: 3000,
  });
}
