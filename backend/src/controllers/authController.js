import User from "../models/user.js";

const postRegister = async (req, res) => {
  const { id, name, email } = req.body;

  const existedEmail = await User.findOne({ email: email });
  if (existedEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const createdUser = await User.create({
    firebaseId: id,
    name,
    email,
    userType: "user",
  });

  return res.status(200).json({ message: "Register success", data: createdUser });
};

const postLogin = async (req, res) => {
  const { id } = req.body;

  const user = User.findOne({ firebaseId: id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "Login success" });
};

const postLogout = async (req, res) => {
  return res.status(200).json({ message: "Logout success" });
};

export {
  postRegister,
  postLogin,
  postLogout,
};
