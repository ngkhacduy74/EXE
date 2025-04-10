import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Flex, Input, notification, Typography } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Space } from "antd";
import { createStyles } from "antd-style";
import verifyOTPApi from "../Services/api.service";

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const { Title } = Typography;
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  console.log("Email from login:", email);
  const [otp, setOTP] = useState("");
  const hanldeClick = async () => {
    const res = await verifyOTPApi(email, otp);
    notification.success({
      message: "OTP Successfully",
      description: "Đăng nhập thành công!",
    });
    try {
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("OTP error:", err);
    }
  };
  const { styles } = useStyle();
  const onChange = (text) => {
    console.log("onChange:", text);
  };
  const onInput = (value) => {
    console.log("onInput:", value);
  };
  const sharedProps = {
    onChange,
    onInput,
  };
  return (
    <div>
      <h1>hello otp</h1>
      <Flex gap="middle" align="flex-start" vertical>
        <Title level={5}>With custom display character</Title>
        <Input.OTP
          mask="🔒"
          {...sharedProps}
          onChange={(event) => {
            setOTP(event);
          }}
        />
      </Flex>
      <ConfigProvider
        button={{
          className: styles.linearGradientButton,
        }}
      >
        <Space>
          <Button type="primary" size="middle" onClick={() => hanldeClick()}>
            Send OTP
          </Button>
        </Space>
      </ConfigProvider>
    </div>
  );
};
export default App;
