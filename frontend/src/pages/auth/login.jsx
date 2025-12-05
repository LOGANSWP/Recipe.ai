import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  message,
} from "antd";

import { login } from "../../api/authApi";
import { useAuth } from "../../auth/AuthContent";
import AuthLayout from "./AuthLayout";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (firebaseUser) {
      navigate("/", { replace: true });
    }
  }, [firebaseUser, navigate]);

  const postLogin = async (email, password) => {
    try {
      setLoading(true);
      await login(email, password);
      message.success("Login success");
      navigate("/");
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
    <AuthLayout>
      <Card title="User Login" className="w-96">
        <Form
          onFinish={handleOnFinish}
          layout="vertical"
        >
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
            <Space>
              Don't have an account yet?
              <Link to="/register">Register</Link>
            </Space>
          </div>
        </Form>
      </Card>
    </AuthLayout>
  );
};

export default Login;
