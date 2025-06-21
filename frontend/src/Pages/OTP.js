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
import { authApiClient } from "../Services/auth.service";
import axios from "axios";

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

  // Token storage utility with error handling
  const storeTokens = (accessToken, refreshToken) => {
    try {
      if (accessToken) {
        localStorage.setItem("token", accessToken);
        console.log("Access token saved to localStorage:", accessToken.substring(0, 20) + "...");
      }
      
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        console.log("Refresh token saved to localStorage:", refreshToken.substring(0, 20) + "...");
      }
      
      return true;
    } catch (error) {
      console.error("Error storing tokens:", error);
      notification.error({
        message: "Storage Error",
        description: "Không thể lưu thông tin đăng nhập. Vui lòng thử lại.",
      });
      return false;
    }
  };

  // Clear tokens utility
  const clearTokens = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await authApiClient.get("/otp/verifyOTP", { 
        params: { email, otp } 
      });
      console.log("OTP verification response:", res.data);

      if (res && res.data.success) {
        const { token, refresh_token } = res.data;

        // Validate tokens before storing
        if (!token) {
          throw new Error("No access token received from server");
        }

        // Store tokens with error handling
        const tokensStored = storeTokens(token, refresh_token);
        if (!tokensStored) {
          return; // Exit if token storage failed
        }

        // Show success notification
        notification.success({
          message: "OTP Verification Successful",
          description: "Đăng nhập thành công!",
        });

        try {
          // Fetch user data - use axios directly since this endpoint doesn't need auth
          console.log("🔍 Fetching user data for email:", email);
          const userRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/getUserByEmail?email=${encodeURIComponent(email)}`);
          console.log("✅ User response:", userRes.data);

          // Store user data
          if (userRes.data && userRes.data.user) {
            console.log("💾 Storing user data:", userRes.data.user);
            localStorage.setItem("user", JSON.stringify(userRes.data.user));
            
            // Navigate based on user role
            const userRole = userRes.data.user.role;
            const destination = userRole === "Admin" ? "/admin" : "/";
            console.log("🚀 Navigating to:", destination);
            
            navigate(destination, {
              state: {
                token,
                refresh_token,
                user: userRes.data.user,
              },
            });
          } else {
            console.log("❌ Invalid user data received:", userRes.data);
            throw new Error("Invalid user data received");
          }

        } catch (userError) {
          console.error("❌ Error fetching user data:", userError);
          console.error("Error details:", {
            message: userError.message,
            status: userError.response?.status,
            data: userError.response?.data
          });
          
          notification.warning({
            message: "Warning",
            description: "Đăng nhập thành công nhưng không thể tải thông tin người dùng.",
          });

          // Still navigate to home page with tokens
          console.log("🚀 Navigating to home page with tokens only");
          navigate("/", {
            state: {
              token,
              refresh_token,
            },
          });
        }

      } else {
        // Handle OTP verification failure
        const errorMessage = res.data?.error || "Xác thực không thành công.";
        notification.error({
          message: "OTP Verification Failed",
          description: errorMessage,
        });
      }
    } catch (err) {
      console.error("❌ OTP error:", err);

      // Handle different error types
      if (err.response?.status === 400) {
        notification.error({
          message: "Invalid OTP",
          description: "Mã OTP không hợp lệ hoặc đã hết hạn.",
        });
      } else if (err.response?.status === 429) {
        notification.error({
          message: "Too Many Attempts",
          description: "Quá nhiều lần thử. Vui lòng đợi một chút.",
        });
      } else if (err.response?.status === 401) {
        notification.error({
          message: "OTP Expired",
          description: "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.",
        });
      } else {
        notification.error({
          message: "System Error",
          description: "Lỗi hệ thống. Vui lòng thử lại sau.",
        });
      }

      // Clear any partially stored data on error
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP function (optional)
  const handleResendOTP = async () => {
    try {
      // Implement resend OTP API call here
      // const resendRes = await resendOTPApi(email);
      notification.info({
        message: "OTP Sent",
        description: "Mã OTP mới đã được gửi đến email của bạn.",
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      notification.error({
        message: "Resend Failed",
        description: "Không thể gửi lại mã OTP. Vui lòng thử lại.",
      });
    }
  };

  // Add validation for OTP length
  const isOTPValid = otp && otp.length === 6;

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
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

      <Flex justify="center" align="center" style={{ minHeight: "100vh", padding: 16 }}>
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
          <Text type="secondary">
            Mã OTP đã gửi đến email: <strong>{email}</strong>
          </Text>

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
              disabled={!isOTPValid}
              style={{ marginTop: 16 }}
            >
              {loading ? "Đang xác thực..." : "Xác thực"}
            </Button>
          </ConfigProvider>

          {/* Resend OTP button */}
          <Button
            type="link"
            onClick={handleResendOTP}
            style={{ marginTop: 8 }}
            disabled={loading}
          >
            Gửi lại mã OTP
          </Button>

          {/* Debug info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
              <div>Email: {email}</div>
              <div>OTP Length: {otp.length}/6</div>
              <div>Valid: {isOTPValid ? 'Yes' : 'No'}</div>
            </div>
          )}
        </Card>
      </Flex>
    </div>
  );
};

export default App;