import connectToDB from "@/configs/db";
import ProductModel from "@/models/Product";
import { writeFile } from "fs/promises";
import path from "path";

// POST: Create a new product with file upload
export async function POST(req) {
  try {
    // Connect to the database
    connectToDB();

    // Parse form data
    const formData = await req.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const shortDescription = formData.get("shortDescription");
    const longDescription = formData.get("longDescription");
    const tags = formData.get("tags");
    const img = formData.get("img");

    // Validate required fields
    if (!name || !price || !img) {
      return Response.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    // Process the image
    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = `${Date.now()}-${img.name}`;
    const imgPath = path.join(process.cwd(), "public/uploads/", filename);

    // Save the image to the uploads directory
    await writeFile(imgPath, buffer);
    const imgUrl = `/uploads/${filename}`; // Use relative path for serving

    // Save the product to the database
    const product = await ProductModel.create({
      name,
      price,
      shortDescription,
      longDescription,
      tags,
      img: imgUrl,
    });

    // Return success response
    return Response.json(
      { message: "Product created successfully!", data: product },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating product:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

// PUT: Update the product image
export async function PUT(req) {
  try {
    // Parse form data
    const formData = await req.formData();
    const img = formData.get("img");

    // Validate if image is provided
    if (!img) {
      return Response.json({ message: "No image provided!" }, { status: 400 });
    }

    // Process the new image
    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = `${Date.now()}-${img.name}`;
    const imgPath = path.join(process.cwd(), "public/uploads/", filename);

    // Save the new image to the uploads directory
    await writeFile(imgPath, buffer);
    const imgUrl = `/uploads/${filename}`; // Use relative path for serving

    // Return success response
    return Response.json(
      { message: "File uploaded successfully!", filePath: imgUrl },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error uploading file:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

// GET: Retrieve all products
export async function GET() {
  try {
    // Connect to the database and fetch products
    connectToDB();
    const products = await ProductModel.find({}, "-__v").populate("comments");

    // Return products in the response
    return Response.json(products, { status: 200 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
