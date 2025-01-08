import { cookies } from "next/headers";
import UserModel from "@/models/User";
import connectToDB from "@/configs/db";
import { verifyAccessToken } from "./auth";

const authUser = async () => {
  await connectToDB();
  const cookieStore = await cookies();
  const token = await cookieStore.get("token");
  console.log("token in authUser func", token);
  let user = null;

  if (token) {
    const tokenPayload = verifyAccessToken(token.value);
    if (tokenPayload) {
      user = await UserModel.findOne({ email: tokenPayload.email });
      console.log("user in authUser func", user);
    }
  }

  return user;
};

const authAdmin = async () => {
  await connectToDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  let user = null;

  if (token) {
    const tokenPayload = verifyAccessToken(token.value);
    if (tokenPayload) {
      user = await UserModel.findOne({ email: tokenPayload.email });
      if (user.role === "ADMIN") {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }

  return user;
};

const separateUserNotWantedInfo = (createdUser) => {
  const { password, _id, __v, ...userDetails } = createdUser.toObject();

  return userDetails;
};

export { authUser, authAdmin, separateUserNotWantedInfo };
