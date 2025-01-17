import connectToDB from "@/configs/db";
import ProductCategoryModel from "@/models/ProductCategory";
import { writeFile } from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser to handle form data manually
  },
};

// POST: Create a new product category with file upload
export async function POST(req) {
  try {
    // Connect to the database
    connectToDB();

    // Parse the form data
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const img = formData.get("img");

    // Validate required fields
    if (!title) {
      return Response.json({ message: "Title is required!" }, { status: 400 });
    }

    let imgPath = null;

    // Process the image if provided
    if (img) {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filename = `${Date.now()}-${img.name}`;
      imgPath = path.join(process.cwd(), "public/uploads/", filename);

      // Save the image to the uploads directory
      await writeFile(imgPath, buffer);
      imgPath = `/uploads/${filename}`; // Use relative path for serving
    }

    // Save the category to the database
    const category = await ProductCategoryModel.create({
      title,
      description,
      img: imgPath,
    });

    // Return success response
    return Response.json(
      { message: "Category created successfully!", data: category },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating category:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

// PUT: Update the image of an existing product category
export async function PUT(req) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const id = formData.get("id");
    const img = formData.get("img");

    // Validate required fields
    if (!id) {
      return Response.json(
        { message: "Category ID is required!" },
        { status: 400 }
      );
    }

    if (!img) {
      return Response.json({ message: "No image provided!" }, { status: 400 });
    }

    // Find the category in the database
    const category = await ProductCategoryModel.findById(id);

    if (!category) {
      return Response.json({ message: "Category not found!" }, { status: 404 });
    }

    // Process the new image
    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = `${Date.now()}-${img.name}`;
    const imgPath = path.join(process.cwd(), "public/uploads/", filename);

    // Save the new image
    await writeFile(imgPath, buffer);

    // Update the category image
    category.img = `/uploads/${filename}`;
    await category.save();

    // Return success response
    return Response.json(
      { message: "Category image updated successfully!", data: category },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating category image:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

// GET: Retrieve all product categories
export async function GET() {
  try {
    // Connect to the database and fetch categories
    connectToDB();
    const categories = await ProductCategoryModel.find({}, "-__v");

    // Return categories in the response
    return Response.json(categories, { status: 200 });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
