import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import Product from "@/components/modules/product/Product";

import styles from "@/styles/rules.module.css";
import { authUser } from "@/utils/serverHelpers";
import ProductModel from "@/models/Product";
import connectToDB from "@/configs/db";

const page = async () => {
  connectToDB();
  const user = await authUser();

  const products = await ProductModel.find({}).sort({ _id: -1 }).limit(10);

  return (
    <>
      <Navbar isLogin={user ? true : false} />
      <Breadcrumb route={" دسته بندی محصولات"} />
      <div className={styles.container} data-aos="fade-up">
        <h1>page category</h1>
        <main data-aos="fade-up" className={styles.products}>
          {products.length > 0 &&
            products.map((product) => (
              <Product key={product._id} {...product} />
            ))}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default page;
