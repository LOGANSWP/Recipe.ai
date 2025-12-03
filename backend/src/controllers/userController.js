

const getUser = async (req, res) => {
  const { user } = req;
  return res.status(200).json({ message: "Get user success", data: user });
};

export {
  getUser,
};
