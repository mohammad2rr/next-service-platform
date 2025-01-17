import React from "react";
import Layout from "@/components/layouts/AdminPanelLayout";
import styles from "@/components/templates/p-admin/products/table.module.css";
import Table from "@/components/templates/p-admin/products/Table";
import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
import AddProduct from "@/components/templates/p-admin/products/AddProduct";

import { Accordion, AccordionTab } from "primereact/accordion";

const page = async () => {
  connectToDB();
  const products = await ProductModel.find({}).sort({ _id: -1 }).lean();

  return (
    <Layout>
      <main>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Accordion activeIndex={1}>
                <AccordionTab header="ایجاد محصول">
                  <AddProduct />{" "}
                </AccordionTab>
              </Accordion>
            </div>
            <div className="col-12">
              {products.length === 0 ? (
                <p className={styles.empty}>محصولی وجود ندارد</p>
              ) : (
                <Table
                  products={JSON.parse(JSON.stringify(products))}
                  title="لیست محصولات"
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
