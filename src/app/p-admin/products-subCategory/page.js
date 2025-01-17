import Layout from "@/components/layouts/AdminPanelLayout";
import connectToDB from "@/configs/db";
import AddProductSubCategory from "@/components/templates/p-admin/products-subCategory/AddProduct-subCategory";

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
                  <AddProductSubCategory />
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
