import connectToDB from "@/configs/db";
import ProductCategoryModel from "@/models/ProductCategory";
import multer from "multer";
import path from "path";
import { NextResponse } from "next/server";

// Set up Multer for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), "public/uploads/"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
    }
  },
});

// Middleware to handle multipart form-data
export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser for file upload
  },
};

// POST Handler for creating a category
export async function POST(req) {
  try {
    const form = new Promise((resolve, reject) => {
      upload.single("img")(req, {}, (err) => {
        if (err) return reject(err);
        resolve(req);
      });
    });

    await form;
    const { title, description } = req.body;
    const img = req.file;

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
      img: img ? `/uploads/${img.filename}` : null, // Save relative path for serving
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
