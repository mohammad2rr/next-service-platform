import Layout from "@/components/layouts/AdminPanelLayout";
import connectToDB from "@/configs/db";

import { Accordion, AccordionTab } from "primereact/accordion";

const page = async () => {
  connectToDB();

  return (
    <Layout>
      <main>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Accordion activeIndex={0}>
                <AccordionTab header="ایجاد زیر دسته محصولات">
                  <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do
                  </p>
                </AccordionTab>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default page;
