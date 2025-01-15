import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
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

// POST Handler
export async function POST(req) {
  try {
    const form = new Promise((resolve, reject) => {
      upload.single("img")(req, {}, (err) => {
        if (err) return reject(err);
        resolve(req);
      });
    });

    await form;
    const { name, price, shortDescription, longDescription, tags } = req.body;
    const img = req.file;

    // Validate required fields
    if (!name || !price || !img) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    const product = await ProductModel.create({
      name,
      price,
      shortDescription,
      longDescription,
      tags,
      img: `/uploads/${img.filename}`, // Save relative path for serving
    });

    return NextResponse.json(
      { message: "Product created successfully!", data: product },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error uploading file:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// PUT Handler for Image Upload
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

    if (!img) {
      return NextResponse.json(
        { message: "No image provided!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "File uploaded successfully!",
        filePath: `/uploads/${img.filename}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error uploading file:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// GET Handler for Products
export async function GET() {
  try {
    const products = await ProductModel.find({}, "-__v").populate("comments");
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
