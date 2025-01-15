import React from "react";
import Layout from "@/components/layouts/AdminPanelLayout";
import styles from "@/components/templates/p-admin/products/table.module.css";
import Table from "@/components/templates/p-admin/products/Table";
import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
import AddProduct from "@/components/templates/p-admin/products/AddProduct";

const page = async () => {
  connectToDB();
  const products = await ProductModel.find({}).sort({ _id: -1 }).lean();

  return (
    <Layout>
      <main>
        <p>products sub category</p>
      </main>
    </Layout>
  );
};

export default page;
