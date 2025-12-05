import { ConfigProvider } from "antd";

const AuthLayout = ({ children }) => {
  return (
    <main className="relative bg-gray-50 min-h-[calc(100vh-80px)] flex justify-center items-center p-6 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 -z-0" />

      <div className="relative z-10 flex flex-col items-center">
        <ConfigProvider
          theme={{ token: { colorPrimary: "#4CA154" } }}
        >
          {children}
        </ConfigProvider>
      </div>
    </main>
  );
};

export default AuthLayout;
