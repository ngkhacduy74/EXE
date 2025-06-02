import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, MessageCircle, X, LogIn } from 'lucide-react';

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1000
  },
  iconButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    outline: 'none'
  },
  chatContainer: {
    position: 'absolute',
    bottom: '60px',
    right: '0',
    width: 'min(500px, calc(100vw - 48px))',
    height: 'min(700px, calc(100vh - 120px))',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    // Mobile full screen
    '@media (max-width: 768px)': {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100vh',
      borderRadius: '0'
    }
  },
  header: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    margin: 0,
    fontWeight: 500,
    fontSize: '16px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '4px'
  },
  messagesContainer: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#f9fafb'
  },
  messageRow: {
    display: 'flex',
    marginBottom: '16px'
  },
  userRow: {
    justifyContent: 'flex-end'
  },
  botRow: {
    justifyContent: 'flex-start'
  },
  messageBubble: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px 16px',  // Tăng padding
    maxWidth: '85%',       // Tăng từ 80% lên 85%
    borderRadius: '12px',  // Bo góc hơi lớn hơn
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    fontSize: '14px',      // Có thể tăng font size
    lineHeight: '1.5'      // Tăng line height cho dễ đọc
  },
  userBubble: {
    backgroundColor: '#2563eb',
    color: 'white',
    borderTopRightRadius: '0'
  },
  botBubble: {
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    borderTopLeftRadius: '0'
  },
  iconContainer: {
    marginRight: '8px',
    marginTop: '4px'
  },
  inputArea: {
    borderTop: '1px solid #e5e7eb',
    padding: '12px',
    backgroundColor: 'white'
  },
  inputContainer: {
    display: 'flex',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    outline: 'none',
    fontSize: '14px'
  },
  sendButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer'
  },
  loginMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '20px',
    textAlign: 'center'
  },
  loginButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    marginTop: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500
  }
};

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Kiểm tra cả token và user data
      const savedToken = localStorage.getItem("token");
      const userData = localStorage.getItem('user');
      
      if (savedToken && userData) {
        try {
          const user = JSON.parse(userData);
          const name = user.fullname || user.username || user.email || null;
          
          if (name) {
            setToken(savedToken);
            setIsLoggedIn(true);
            setUsername(name);
            setMessages([
              {
                id: 1,
                text: `Chào ${name}! Tôi có thể giúp gì cho bạn hôm nay?`,
                sender: 'bot',
              },
            ]);
          } else {
            throw new Error('Không tìm thấy tên người dùng hợp lệ');
          }
        } catch (error) {
          console.error('Lỗi phân tích dữ liệu người dùng:', error);
          handleAuthError();
        }
      } else {
        handleAuthError();
      }
    } else {
      setMessages([]);
    }
  }, [isOpen]);

  const handleAuthError = () => {
    setIsLoggedIn(false);
    setToken(null);
    setMessages([
      {
        id: 1,
        text: 'Bạn phải đăng nhập để sử dụng hộp trò chuyện',
        sender: 'bot',
      },
    ]);
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || !isLoggedIn || !token) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');
    setIsBotTyping(true);

    try {
      const response = await fetch('http://localhost:4000/chat/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Chỉ thêm Authorization nếu có token
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ prompt: inputValue }),
      });

      if (response.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        handleTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Mã trạng thái: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = {
        id: messages.length + 2,
        text: data.answer || data.response || 'Xin lỗi, tôi không hiểu bạn nói gì.',
        sender: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Lỗi khi lấy phản hồi từ bot:', error);
      const errorResponse = {
        id: messages.length + 2,
        text: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleTokenExpired = () => {
    // Xóa token và user data khi hết hạn
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setToken(null);
    setIsLoggedIn(false);
    setMessages([
      {
        id: 1,
        text: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        sender: 'bot',
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.iconButton}
        onClick={toggleChat}
        aria-label={isOpen ? 'Đóng trò chuyện' : 'Mở trò chuyện'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div style={styles.chatContainer}>
          <div style={styles.header}>
            <h2 style={styles.headerTitle}>Hỗ trợ trò chuyện</h2>
            <button
              onClick={toggleChat}
              style={styles.closeButton}
              aria-label="Đóng trò chuyện"
            >
              <X size={18} />
            </button>
          </div>

          {isLoggedIn ? (
            <>
              <div style={styles.messagesContainer} ref={messagesContainerRef}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      ...styles.messageRow,
                      ...(message.sender === 'user' ? styles.userRow : styles.botRow),
                    }}
                  >
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(message.sender === 'user' ? styles.userBubble : styles.botBubble),
                      }}
                    >
                      <div style={styles.iconContainer}>
                        {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div style={styles.messageRow}>
                    <div style={{ ...styles.messageBubble, ...styles.botBubble }}>
                      <div style={styles.iconContainer}>
                        <Bot size={16} />
                      </div>
                      <p>Đang trả lời...</p>
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.inputArea}>
                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    style={styles.input}
                    aria-label="Nhập tin nhắn trò chuyện"
                  />
                  <button
                    onClick={handleSendMessage}
                    style={styles.sendButton}
                    aria-label="Gửi tin nhắn"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={styles.loginMessage}>
              <Bot size={48} color="#2563eb" />
              <h3 style={{ marginTop: '16px', color: '#1f2937' }}>Vui lòng đăng nhập để trò chuyện</h3>
              <p style={{ color: '#6b7280', margin: '8px 0' }}>
                Bạn cần đăng nhập để sử dụng hộp trò chuyện. Hãy đăng nhập để tiếp tục.
              </p>
              <button
                style={styles.loginButton}
                onClick={redirectToLogin}
                aria-label="Đăng nhập để tiếp tục"
              >
                <LogIn size={18} />
                Đăng nhập ngay
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}