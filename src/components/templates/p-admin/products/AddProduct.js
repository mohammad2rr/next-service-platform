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
    weight: Yup.number()
      .typeError("وزن باید یک عدد باشد")
      .required("وزن الزامی است"),
    suitableFor: Yup.string().required("مناسب برای الزامی است"),
    smell: Yup.string().required("میزان بو الزامی است"),
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
      weight: "",
      suitableFor: "",
      smell: "",
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
      formData.append("weight", values.weight);
      formData.append("suitableFor", values.suitableFor);
      formData.append("smell", values.smell);
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
    <section className={styles.discount}>
      <p>افزودن محصول جدید</p>
      <form className={styles.discount_main} onSubmit={formik.handleSubmit}>
        <div>
          <label>نام محصول</label>
          <input
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
          <label>مبلغ محصول</label>
          <input
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
          <label>توضیحات کوتاه</label>
          <input
            name="shortDescription"
            value={formik.values.shortDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="توضیحات کوتاه محصول"
            type="text"
          />
          {formik.touched.shortDescription && formik.errors.shortDescription ? (
            <div className={styles.error}>{formik.errors.shortDescription}</div>
          ) : null}
        </div>

        <div>
          <label>توضیحات بلند</label>
          <input
            name="longDescription"
            value={formik.values.longDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="توضیحات بلند محصول"
            type="text"
          />
          {formik.touched.longDescription && formik.errors.longDescription ? (
            <div className={styles.error}>{formik.errors.longDescription}</div>
          ) : null}
        </div>

        <div>
          <label>وزن</label>
          <input
            name="weight"
            value={formik.values.weight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="وزن محصول"
            type="text"
          />
          {formik.touched.weight && formik.errors.weight ? (
            <div className={styles.error}>{formik.errors.weight}</div>
          ) : null}
        </div>

        <div>
          <label>مناسب برای:</label>
          <input
            name="suitableFor"
            value={formik.values.suitableFor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="مناسب برای ..."
            type="text"
          />
          {formik.touched.suitableFor && formik.errors.suitableFor ? (
            <div className={styles.error}>{formik.errors.suitableFor}</div>
          ) : null}
        </div>

        <div>
          <label>میزان بو</label>
          <input
            name="smell"
            value={formik.values.smell}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="میزان بو"
            type="text"
          />
          {formik.touched.smell && formik.errors.smell ? (
            <div className={styles.error}>{formik.errors.smell}</div>
          ) : null}
        </div>

        <div>
          <label>تگ های محصول</label>
          <input
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
          <label>تصویر محصول</label>
          <input
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
  );
}

export default AddProduct;
