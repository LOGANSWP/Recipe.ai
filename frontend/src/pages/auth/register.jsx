import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  message,
} from "antd";

import { register } from "../../api/authApi";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const postRegister = async (name, email, password) => {
    try {
      setLoading(true);
      await register(name, email, password);
      message.success("Register success");
      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnFinish = async (values) => {
    const { name, email, password } = values;
    await postRegister(name, email, password);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <Card title="User Register" className="w-80">
        <Form onFinish={handleOnFinish} layout="vertical">
          <Form.Item
            label="Nickname"
            name="name"
            rules={[
              { required: true },
              { min: 3, max: 20 },
            ]}
          >
            <Input placeholder="Please enter your nickname..." />
          </Form.Item>

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
            hasFeedback
            rules={[
              { required: true },
              { min: 6, max: 20 },
            ]}
          >
            <Input.Password placeholder="Please enter your password..." />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Password do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Please confirm your password..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            <Space>
              Already have an account?
              <Link to="/login">Login</Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
