import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { generateAccessToken, hashPassword } from "@/utils/auth";
import { roles } from "@/utils/constants";
import { separateUserNotWantedInfo } from "@/utils/serverHelpers";

export async function POST(req) {
  connectToDB();
  const body = await req.json();
  const { name, phone, email, password } = body;

  // Validation (You)

  const isUserExist = await UserModel.findOne({
    $or: [{ name }, { email }, { phone }],
  });

  if (isUserExist) {
    return Response.json(
      {
        message: "The username or email or phone exist already !!",
      },
      {
        status: 422,
      }
    );
  }

  const hashedPassword = await hashPassword(password);
  const accessToken = generateAccessToken({ name, email });

  const users = await UserModel.find({});

  const createdUser = await UserModel.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: users.length > 0 ? roles.USER : roles.ADMIN,
  });

  const lightUserInfo = separateUserNotWantedInfo(createdUser);

  return Response.json(
    { message: "User signed up successfully :))", user: lightUserInfo },
    {
      status: 201,
      headers: { "Set-Cookie": `token=${accessToken};path=/;httpOnly=true` },
    }
  );
}
