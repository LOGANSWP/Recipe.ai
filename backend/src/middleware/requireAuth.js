const requireAuth = (req, res, next) => {
  // TODO: Replace this with real JWT verification from your teammate
  
  // MOCK USER: We are pretending we are a logged-in user with this ID
  req.user = {
    id: "654b9f2d1234567890abcdef" // A fake MongoDB ObjectId
  };
  
  next();
};

export default requireAuth;