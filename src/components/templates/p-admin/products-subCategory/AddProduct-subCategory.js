"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import styles from "./table.module.css";

function AddProductSubCategory() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/productCategories");
      const data = await res.json();
      console.log("productCategories", data);

      setCategories(data);
    }
    fetchCategories();
  }, []);

  // Define Yup validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("عنوان زیر دسته‌بندی الزامی است"),
    description: Yup.string(),
    productCategory: Yup.string().required("دسته‌بندی اصلی الزامی است"),
    img: Yup.mixed(),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      productCategory: "",
      img: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("productCategory", values.productCategory);
      formData.append("img", values.img);

      const res = await fetch("/api/productSubCategories", {
        method: "POST",
        body: formData,
      });

      if (res.status === 201) {
        swal({
          title: "زیر دسته‌بندی با موفقیت ایجاد شد",
          icon: "success",
          buttons: "فهمیدم",
        }).then(() => {
          router.refresh();
        });
      }
    },
  });

  return (
    <>
      <div className="row">
        <div className="col-6">
          <section className={styles.discount}>
            <p>افزودن زیر دسته‌بندی جدید</p>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label className="form-label">عنوان زیر دسته‌بندی</label>
                <input
                  className="form-control"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="لطفا عنوان زیر دسته‌بندی را وارد کنید"
                  type="text"
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className={styles.error}>{formik.errors.title}</div>
                ) : null}
              </div>

              <div>
                <label className="form-label">توضیحات زیر دسته‌بندی</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="توضیحات زیر دسته‌بندی"
                />
                {formik.touched.description && formik.errors.description ? (
                  <div className={styles.error}>
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="form-label">دسته‌بندی اصلی</label>
                <select
                  className="form-control"
                  name="productCategory"
                  value={formik.values.productCategory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">انتخاب کنید</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {formik.touched.productCategory &&
                formik.errors.productCategory ? (
                  <div className={styles.error}>
                    {formik.errors.productCategory}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="form-label">تصویر زیر دسته‌بندی</label>
                <input
                  className="form-control"
                  name="img"
                  type="file"
                  onChange={(event) =>
                    formik.setFieldValue("img", event.target.files[0])
                  }
                />
                {formik.touched.img && formik.errors.img ? (
                  <div className={styles.error}>{formik.errors.img}</div>
                ) : null}
              </div>

              <button type="submit">افزودن</button>
            </form>
          </section>
        </div>
        <div className="col-6"></div>
      </div>
    </>
  );
}

export default AddProductSubCategory;
