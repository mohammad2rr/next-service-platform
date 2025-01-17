import React from "react";
import Layout from "@/components/layouts/AdminPanelLayout";
import connectToDB from "@/configs/db";
import AddProductCategory from "@/components/templates/p-admin/products-category/AddProduct-category";

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
                <AccordionTab header="ایجاد دسته بندی محصولات">
                  <AddProductCategory />
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
