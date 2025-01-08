import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";

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
      <Breadcrumb route={" مقالات"} />
      <div className={styles.container} data-aos="fade-up">
        <h1>page blog</h1>
        <div className="card">
          <Accordion activeIndex={0}>
            <AccordionTab header="Header I">
              <p className="m-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              </p>
            </AccordionTab>
            <AccordionTab header="Header II">
              <p className="m-0">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              </p>
            </AccordionTab>
            <AccordionTab header="Header III">
              <p className="m-0">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
              </p>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
