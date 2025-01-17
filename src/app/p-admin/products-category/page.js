import React from "react";
import Layout from "@/components/layouts/AdminPanelLayout";
import connectToDB from "@/configs/db";
import AddProductCategory from "@/components/templates/p-admin/products-category/AddProduct-category";
import ProductCategoryModel from "@/models/ProductCategory";
import Table from "@/components/templates/p-admin/products-category/Table";

import { Accordion, AccordionTab } from "primereact/accordion";

const page = async () => {
  connectToDB();
  const productCategories = await ProductCategoryModel.find({})
    .sort({ _id: -1 })
    .lean();

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
            <div className="col-12">
              {productCategories.length === 0 ? (
                <p className={styles.empty}>دسته بندی محصولی وجود ندارد</p>
              ) : (
                <Table
                  productCategories={JSON.parse(
                    JSON.stringify(productCategories)
                  )}
                  title="لیست دسته بندی محصلات"
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
