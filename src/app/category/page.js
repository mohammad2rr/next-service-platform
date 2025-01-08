import Breadcrumb from "@/components/modules/breadcrumb/Breadcrumb";
import Footer from "@/components/modules/footer/Footer";
import Navbar from "@/components/modules/navbar/Navbar";
import styles from "@/styles/rules.module.css";
import { authUser } from "@/utils/serverHelpers";
const page = async () => {
  const user = await authUser();

  return (
    <>
      <Navbar isLogin={user ? true : false} />
      <Breadcrumb route={" دسته بندی محصولات"} />
      <div className={styles.container} data-aos="fade-up">
        <h1>page category</h1>
      </div>
      <Footer />
    </>
  );
};

export default page;
