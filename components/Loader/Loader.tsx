import { DotLoader } from "react-spinners";
import css from "../Loader/Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loader}>
      <DotLoader color="#0d6efd" size={60} loading={true} />
    </div>
  );
}
