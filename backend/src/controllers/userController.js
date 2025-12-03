

const getMyUser = async (req, res) => {
  const { user } = req;
  return res.status(200).json({ message: "Get user success", data: user });
};

export {
  getMyUser,
};
