"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import styles from "./table.module.css";

function AddProductCategory() {
  const router = useRouter();

  // Define Yup validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("عنوان دسته‌بندی الزامی است"),
    description: Yup.string(),
    img: Yup.mixed(),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      img: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("img", values.img);

      const res = await fetch("/api/productCategories", {
        method: "POST",
        body: formData,
      });

      if (res.status === 201) {
        swal({
          title: "دسته‌بندی با موفقیت ایجاد شد",
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
            <p>افزودن دسته‌بندی جدید</p>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label className="form-label">عنوان دسته‌بندی</label>
                <input
                  className="form-control"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="لطفا عنوان دسته‌بندی را وارد کنید"
                  type="text"
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className={styles.error}>{formik.errors.title}</div>
                ) : null}
              </div>

              <div>
                <label className="form-label">توضیحات دسته‌بندی</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="توضیحات دسته‌بندی"
                />
                {formik.touched.description && formik.errors.description ? (
                  <div className={styles.error}>
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="form-label">تصویر دسته‌بندی</label>
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

export default AddProductCategory;
