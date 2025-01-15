"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import styles from "./table.module.css";

function AddProduct() {
  const router = useRouter();

  // Define Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("نام محصول الزامی است"),
    price: Yup.number()
      .typeError("مبلغ باید یک عدد باشد")
      .required("مبلغ محصول الزامی است"),
    shortDescription: Yup.string().required("توضیحات کوتاه الزامی است"),
    longDescription: Yup.string().required("توضیحات بلند الزامی است"),
    tags: Yup.string().required("تگ‌های محصول الزامی است"),
    img: Yup.mixed().required("تصویر محصول الزامی است"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      shortDescription: "",
      longDescription: "",
      tags: "",
      img: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("shortDescription", values.shortDescription);
      formData.append("longDescription", values.longDescription);
      formData.append("tags", values.tags.split("،"));
      formData.append("img", values.img);

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (res.status === 201) {
        swal({
          title: "محصول مورد نظر با موفقیت ایجاد شد",
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
                <label className="form-label">مبلغ محصول</label>
                <input
                  className="form-control"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="لطفا مبلغ محصول را وارد کنید"
                  type="text"
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
                <input
                  className="form-control"
                  name="longDescription"
                  value={formik.values.longDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="توضیحات بلند محصول"
                  type="text"
                />
                {formik.touched.longDescription &&
                formik.errors.longDescription ? (
                  <div className={styles.error}>
                    {formik.errors.longDescription}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="form-label">تگ های محصول</label>
                <input
                  className="form-control"
                  name="tags"
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="مثال: قهوه،قهوه ترک، قهوه اسپرسو"
                  type="text"
                />
                {formik.touched.tags && formik.errors.tags ? (
                  <div className={styles.error}>{formik.errors.tags}</div>
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
