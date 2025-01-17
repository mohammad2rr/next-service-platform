"use client";
import { useRouter } from "next/navigation";
import styles from "./table.module.css";
export default function DataTable({ productSubCategories, title }) {
  const router = useRouter();

  return (
    <div>
      <div>
        <h1 className={styles.title}>
          <span>{title}</span>
        </h1>
      </div>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام</th>
              <th>توضیحات</th>
              <th>دسته‌بندی</th>
              <th>مشاهده جزئیات</th>
              <th>ویرایش</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {productSubCategories.map((producSubCategory, index) => (
              <tr key={producSubCategory._id}>
                <td>{index + 1}</td>
                <td>{producSubCategory.title}</td>
                <td>{producSubCategory.description}</td>
                <td>{producSubCategory.productCategory}</td>

                <td>
                  <button type="button" className={styles.edit_btn}>
                    مشاهده جزئیات
                  </button>
                </td>
                <td>
                  <button type="button" className={styles.edit_btn}>
                    ویرایش
                  </button>
                </td>
                <td>
                  <button type="button" className={styles.delete_btn}>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
