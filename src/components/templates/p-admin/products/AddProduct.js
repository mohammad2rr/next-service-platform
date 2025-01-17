"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import styles from "./table.module.css";

function AddProduct() {
  const router = useRouter();
  const [subCategories, setSubCategories] = useState([]);

  // Fetch product subcategories on component mount
  useEffect(() => {
    async function fetchSubCategories() {
      const res = await fetch("/api/productSubCategories");
      const data = await res.json();
      console.log("productSubCategories", data);

      setSubCategories(data);
    }
    fetchSubCategories();
  }, []);

  // Define Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("نام محصول الزامی است"),
    price: Yup.number()
      .required("قیمت محصول الزامی است")
      .positive("قیمت باید عدد مثبت باشد"),
    shortDescription: Yup.string().required("توضیحات کوتاه الزامی است"),
    longDescription: Yup.string().required("توضیحات بلند الزامی است"),
    tags: Yup.array().of(Yup.string()).required("تگ‌ها الزامی هستند"),
    subCategory: Yup.string().required("زیر دسته‌بندی محصول الزامی است"),
    img: Yup.mixed().required("تصویر محصول الزامی است"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      shortDescription: "",
      longDescription: "",
      tags: [],
      subCategory: "",
      img: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("shortDescription", values.shortDescription);
      formData.append("longDescription", values.longDescription);
      formData.append("tags", values.tags.join(","));
      formData.append("subCategory", values.subCategory);
      formData.append("img", values.img);

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (res.status === 201) {
        swal({
          title: "محصول با موفقیت ایجاد شد",
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
            <p>افزودن محصول جدید</p>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label className="form-label">نام محصول</label>
                <input
                  className="form-control"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="لطفا نام محصول را وارد کنید"
                  type="text"
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className={styles.error}>{formik.errors.name}</div>
                ) : null}
              </div>

              <div>
                <label className="form-label">قیمت محصول</label>
                <input
                  className="form-control"
                  name="price"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="لطفا قیمت محصول را وارد کنید"
                />
                {formik.touched.price && formik.errors.price ? (
                  <div className={styles.error}>{formik.errors.price}</div>
                ) : null}
              </div>

              <div>
                <label className="form-label">توضیحات کوتاه</label>
                <input
                  className="form-control"
                  name="shortDescription"
                  value={formik.values.shortDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="توضیحات کوتاه محصول"
                  type="text"
                />
                {formik.touched.shortDescription &&
                formik.errors.shortDescription ? (
                  <div className={styles.error}>
                    {formik.errors.shortDescription}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="form-label">توضیحات بلند</label>
                <textarea
                  className="form-control"
                  name="longDescription"
                  value={formik.values.longDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="توضیحات بلند محصول"
                />
                {formik.touched.longDescription &&
                formik.errors.longDescription ? (
                  <div className={styles.error}>
                    {formik.errors.longDescription}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="form-label">تگ‌ها</label>
                <input
                  className="form-control"
                  name="tags"
                  value={formik.values.tags}
                  onChange={(e) =>
                    formik.setFieldValue("tags", e.target.value.split(","))
                  }
                  onBlur={formik.handleBlur}
                  placeholder="تگ‌ها را وارد کنید (با کاما جدا کنید)"
                />
                {formik.touched.tags && formik.errors.tags ? (
                  <div className={styles.error}>{formik.errors.tags}</div>
                ) : null}
              </div>

              <div>
                <label className="form-label">زیر دسته‌بندی محصول</label>
                <select
                  className="form-control"
                  name="subCategory"
                  value={formik.values.subCategory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">انتخاب کنید</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.title}
                    </option>
                  ))}
                </select>
                {formik.touched.subCategory && formik.errors.subCategory ? (
                  <div className={styles.error}>
                    {formik.errors.subCategory}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="form-label">تصویر محصول</label>
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

export default AddProduct;
