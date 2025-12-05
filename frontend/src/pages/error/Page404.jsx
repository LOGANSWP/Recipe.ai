import ErrorLayout from './ErrorLayout';

const Page404 = () => {
  return (
    <ErrorLayout
      code="404"
      title=" Not Found"
      message="Sorry, the page you are looking for does not exist. You may have entered an incorrect address."
      action={{ to: "/", text: "Go to Home Page" }}
    />
  );
};

export default Page404;
