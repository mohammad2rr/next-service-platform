import Layout from "@/components/layouts/AdminPanelLayout";
import connectToDB from "@/configs/db";
import AddProductSubCategory from "@/components/templates/p-admin/products-subCategory/AddProduct-subCategory";
import ProductSubCategoryModel from "@/models/ProductSubCategory";
import Table from "@/components/templates/p-admin/products-subCategory/Table";

import { Accordion, AccordionTab } from "primereact/accordion";

const page = async () => {
  connectToDB();
  const productSubCategories = await ProductSubCategoryModel.find({})
    .sort({ _id: -1 })
    .lean();

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
            <div className="col-12">
              {productSubCategories.length === 0 ? (
                <p className={styles.empty}>دسته بندی محصولی وجود ندارد</p>
              ) : (
                <Table
                  productSubCategories={JSON.parse(
                    JSON.stringify(productSubCategories)
                  )}
                  title="لیست زیر دسته  محصلات"
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default page;
