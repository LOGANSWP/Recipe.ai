import User from "../models/user";

const postRegister = async (req, res) => {
  const { id, name, email } = req.body;

  const existedEmail = User.findOne({ email: email });
  if (existedEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const createdUser = await User.create({
    _id: id,
    name,
    email,
    userType: "user",
  });

  return res.status(200).json({ message: "Register success", data: createdUser });
};

const postLogin = async (req, res) => {
  const { id } = req.body;

  const user = User.findOne({ _id: id, isDeleted: false });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.lastLogin = new Date();
  await user.save();

  return res.status(200).json({ message: "Login success", data: user });
};

const postLogout = async (req, res) => {
  return res.status(200).json({ message: "Logout success" });
};

export {
  postRegister,
  postLogin,
  postLogout,
};
