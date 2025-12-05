import ErrorLayout from './ErrorLayout';

const Page401 = () => {
  return (
    <ErrorLayout
      code="401"
      title=" Unauthorized"
      message="You need to log in to access this page. Please log in or register an account."
      action={{ to: "/login", text: "Go to Login Page" }}
    />
  );
};

export default Page401;
