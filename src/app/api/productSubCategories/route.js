import connectToDB from "@/configs/db";
import ProductSubCategoryModel from "@/models/ProductSubCategory";
import { writeFile } from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser to handle form data manually
  },
};

// POST: Create a new product subcategory with file upload
export async function POST(req) {
  try {
    // Connect to the database
    connectToDB();

    // Parse the form data
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const productCategory = formData.get("productCategory");
    const img = formData.get("img");

    // Validate required fields
    if (!title || !productCategory) {
      return Response.json(
        { message: "Title and product category are required!" },
        { status: 400 }
      );
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

    // Save the subcategory to the database
    const subCategory = await ProductSubCategoryModel.create({
      title,
      description,
      productCategory,
      img: imgPath,
    });

    // Return success response
    return Response.json(
      { message: "Subcategory created successfully!", data: subCategory },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating subcategory:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

// PUT: Update the image of an existing product subcategory
export async function PUT(req) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const id = formData.get("id");
    const img = formData.get("img");

    // Validate required fields
    if (!id) {
      return Response.json(
        { message: "Subcategory ID is required!" },
        { status: 400 }
      );
    }

    if (!img) {
      return Response.json({ message: "No image provided!" }, { status: 400 });
    }

    // Find the subcategory in the database
    const subCategory = await ProductSubCategoryModel.findById(id);

    if (!subCategory) {
      return Response.json(
        { message: "Subcategory not found!" },
        { status: 404 }
      );
    }

    // Process the new image
    const buffer = Buffer.from(await img.arrayBuffer());
    const filename = `${Date.now()}-${img.name}`;
    const imgPath = path.join(process.cwd(), "public/uploads/", filename);

    // Save the new image
    await writeFile(imgPath, buffer);

    // Update the subcategory image
    subCategory.img = `/uploads/${filename}`;
    await subCategory.save();

    // Return success response
    return Response.json(
      { message: "Subcategory image updated successfully!", data: subCategory },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating subcategory image:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

// GET: Retrieve all product subcategories
export async function GET() {
  try {
    // Connect to the database and fetch subcategories
    connectToDB();
    const subCategories = await ProductSubCategoryModel.find(
      {},
      "-__v"
    ).populate("productCategory", "title");

    // Return subcategories in the response
    return Response.json(subCategories, { status: 200 });
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
