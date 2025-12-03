import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  message,
} from "antd";

import { login } from "../../api/authApi";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const postLogin = async (email, password) => {
    try {
      setLoading(true);
      await login(email, password);
      message.success("Login success");
      navigate("/test");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnFinish = async (values) => {
    const { email, password } = values;
    await postLogin(email, password);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <Card title="User Login" className="w-80">
        <Form onFinish={handleOnFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true },
              { type: "email" },
            ]}
          >
            <Input placeholder="Please enter your Email address..." />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true },
              { min: 6, max: 20 },
            ]}
          >
            <Input.Password placeholder="Please enter your password..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>

          <div className="text-center">
            Don't have an account yet?
            <Link to="/register">Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
