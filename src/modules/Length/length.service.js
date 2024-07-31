import { User } from "../User/user.model.js";

const getAllUsersLength = async () => {
  const users = (await User.find({})).length;
  return users;
};

export const lengthService = {
  getAllUsersLength,
};
