import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import Busboy from "busboy";
import ProductCategoryModel from "@/models/ProductCategory";

const pump = promisify(pipeline);

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser for file upload
  },
};

export async function POST(req) {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers });
    const uploadsDir = path.join(process.cwd(), "public/uploads/");
    const formData = {};

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const saveTo = path.join(uploadsDir, uniqueSuffix + "-" + filename);
      formData[fieldname] = `/uploads/${uniqueSuffix}-${filename}`;

      const writeStream = fs.createWriteStream(saveTo);
      pump(file, writeStream).catch((err) => reject(err));
    });

    busboy.on("field", (fieldname, val) => {
      formData[fieldname] = val;
    });

    busboy.on("finish", async () => {
      try {
        const { title, description, img } = formData;

        // Validate required fields
        if (!title) {
          resolve(
            NextResponse.json(
              { message: "Title is required!" },
              { status: 400 }
            )
          );
          return;
        }

        const category = await ProductCategoryModel.create({
          title,
          description,
          img: img || null, // Save relative path for serving
        });

        resolve(
          NextResponse.json(
            { message: "Category created successfully!", data: category },
            { status: 201 }
          )
        );
      } catch (err) {
        console.error("Error creating category:", err);
        reject(NextResponse.json({ message: err.message }, { status: 500 }));
      }
    });

    busboy.on("error", (err) => reject(err));
    req.body.pipe(busboy);
  });
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
