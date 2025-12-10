import ErrorLayout from './ErrorLayout';

const Page403 = () => {
  return (
    <ErrorLayout
      code="403"
      title=" Forbidden"
      message="Sorry, you do not have access permissions."
      action={{ to: "/", text: "Go to Home Page" }}
    />
  );
};

export default Page403;
