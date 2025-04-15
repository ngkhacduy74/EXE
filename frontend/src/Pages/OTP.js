import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import videoBg from "../Assests/video/video.mp4";

import {
  Flex,
  Input,
  notification,
  Typography,
  Button,
  ConfigProvider,
  Card,
} from "antd";
import { createStyles } from "antd-style";
import verifyOTPApi from "../Services/api.service";
import getUserByEmail from "../Services/auth.service";

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

const { Title, Text } = Typography;

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const { styles } = useStyle();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await verifyOTPApi(email, otp);

      if (res && res.data.success) {
        notification.success({
          message: "OTP Successfully",
          description: "Đăng nhập thành công!",
        });

        const userRes = await getUserByEmail(email);

        localStorage.setItem("user", JSON.stringify(userRes.data.user));
        navigate(userRes.data.user.role === "Admin" ? "/admin" : "/");
      } else {
        notification.error({
          message: "OTP Failed",
          description: res.data.error || "Xác thực không thành công.",
        });
      }
    } catch (err) {
      notification.error({
        message: "OTP Error",
        description: "Lỗi hệ thống. Vui lòng thử lại sau.",
      });
      console.error("❌ OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          minWidth: "100%",
          minHeight: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={videoBg} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video nền.
      </video>

      <Flex
        justify="center"
        align="center"
        style={{ minHeight: "100vh", padding: 16 }}
      >
        <Card
          style={{
            width: 400,
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            textAlign: "center",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <Title level={3}>Xác thực OTP</Title>
          <Text type="secondary">Mã OTP đã gửi đến email</Text>

          <div style={{ marginTop: 24 }}>
            <Input.OTP
              length={6}
              mask="🔒"
              onChange={(val) => setOTP(val)}
              size="large"
              style={{ justifyContent: "center" }}
            />
          </div>

          <ConfigProvider
            button={{
              className: styles.linearGradientButton,
            }}
          >
            <Button
              type="primary"
              size="large"
              onClick={handleClick}
              block
              loading={loading}
              style={{ marginTop: 16 }}
            >
              Xác thực
            </Button>
          </ConfigProvider>
        </Card>
      </Flex>
    </div>
  );
};

export default App;
