import connectToDB from "@/configs/db";
import ProductSubCategoryModel from "@/models/ProductSubCategory";
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

// POST Handler for creating a subcategory
export async function POST(req) {
  try {
    const form = new Promise((resolve, reject) => {
      upload.single("img")(req, {}, (err) => {
        if (err) return reject(err);
        resolve(req);
      });
    });

    await form;
    const { title, description, productCategory } = req.body;
    const img = req.file;

    // Validate required fields
    if (!title || !productCategory) {
      return NextResponse.json(
        { message: "Title and product category are required!" },
        { status: 400 }
      );
    }

    const subCategory = await ProductSubCategoryModel.create({
      title,
      description,
      productCategory,
      img: img ? `/uploads/${img.filename}` : null, // Save relative path for serving
    });

    return NextResponse.json(
      { message: "Subcategory created successfully!", data: subCategory },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating subcategory:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// PUT Handler for updating a subcategory's image
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
        { message: "Subcategory ID is required!" },
        { status: 400 }
      );
    }

    const subCategory = await ProductSubCategoryModel.findById(id);

    if (!subCategory) {
      return NextResponse.json(
        { message: "Subcategory not found!" },
        { status: 404 }
      );
    }

    if (img) {
      subCategory.img = `/uploads/${img.filename}`;
      await subCategory.save();
    }

    return NextResponse.json(
      { message: "Subcategory updated successfully!", data: subCategory },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating subcategory:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// GET Handler for fetching all subcategories
export async function GET() {
  try {
    const subCategories = await ProductSubCategoryModel.find(
      {},
      "-__v"
    ).populate("productCategory", "title");
    return NextResponse.json(subCategories, { status: 200 });
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
