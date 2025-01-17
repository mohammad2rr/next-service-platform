import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ProductCategoryModel from "@/models/ProductCategory";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser for file upload
  },
};

export async function POST(req) {
  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "public/uploads/"),
      keepExtensions: true,
      filename: (name, ext, part) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return `${uniqueSuffix}-${part.originalFilename}`;
      },
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { title, description } = fields;
    const img = files.img;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { message: "Title is required!" },
        { status: 400 }
      );
    }

    const category = await ProductCategoryModel.create({
      title,
      description,
      img: img ? `/uploads/${path.basename(img.filepath)}` : null, // Save relative path for serving
    });

    return NextResponse.json(
      { message: "Category created successfully!", data: category },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// PUT Handler for updating a category's image
export async function PUT(req) {
  try {
    const form = new Promise((resolve, reject) => {
      upload.single("img")(req, {}, (err) => {
        if (err) return reject(err);
        resolve(req);
      });
    });

    await form;
    const img = req.file;
    const { id } = req.body;

    if (!id) {
      return NextResponse.json(
        { message: "Category ID is required!" },
        { status: 400 }
      );
    }

    const category = await ProductCategoryModel.findById(id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found!" },
        { status: 404 }
      );
    }

    if (img) {
      category.img = `/uploads/${img.filename}`;
      await category.save();
    }

    return NextResponse.json(
      { message: "Category updated successfully!", data: category },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating category:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// GET Handler for fetching all categories
export async function GET() {
  try {
    const categories = await ProductCategoryModel.find({}, "-__v");
    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
