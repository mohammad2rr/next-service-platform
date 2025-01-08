import Link from "next/link";
import styles from "./breadcrumb.module.css";
const Breadcrumb = ({ route }) => {
  return (
    <div className={styles.breadcrumb}>
      <p className={styles.title}>{route}</p>
      <div>
        <Link className={styles.routeTitle} href={"/"}>
          خانه
        </Link>
        <span className={styles.routeTitle}>/</span>
        <p className={styles.routeTitle}>{route}</p>
      </div>
    </div>
  );
};

export default Breadcrumb;
