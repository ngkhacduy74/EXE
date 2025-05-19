import { useState, useEffect } from 'react';
import { Send, User, Bot, MessageCircle, X, LogIn } from 'lucide-react';

// Inline styles (unchanged)
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
    width: '320px',
    height: '400px',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb'
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
    padding: '8px 12px',
    maxWidth: '80%',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
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
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Check if user is logged in
      const userData = localStorage.getItem("user");
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const name = user.fullname || user.username || user.email || null;
          
          if (name) {
            setIsLoggedIn(true);
            setUsername(name);
            
            // Set initial bot message with personalized greeting
            setMessages([
              {
                id: 1,
                text: `Hi, ${name}! How can I help you today?`,
                sender: "bot"
              }
            ]);
          } else {
            setIsLoggedIn(false);
            setMessages([
              {
                id: 1,
                text: "You must login to use chat box",
                sender: "bot"
              }
            ]);
          }
        } catch (error) {
          // Handle JSON parse error
          setIsLoggedIn(false);
          setMessages([
            {
              id: 1,
              text: "You must login to use chat box",
              sender: "bot"
            }
          ]);
        }
      } else {
        // No user data found
        setIsLoggedIn(false);
        setMessages([
          {
            id: 1,
            text: "You must login to use chat box",
            sender: "bot"
          }
        ]);
      }
    } else {
      // Clear messages when chat closes
      setMessages([]);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "" || !isLoggedIn) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user"
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Thanks for your message! This is a demo response.",
        sender: "bot"
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const redirectToLogin = () => {
    // Redirect to login page - replace with your actual login URL
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      {/* Chat Icon Button */}
      <button 
        style={styles.iconButton}
        onClick={toggleChat}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </button>
      
      {/* Chat Widget */}
      {isOpen && (
        <div style={styles.chatContainer}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.headerTitle}>Chat Support</h2>
            <button onClick={toggleChat} style={styles.closeButton}>
              <X size={18} />
            </button>
          </div>
          
          {isLoggedIn ? (
            <>
              {/* Messages Container */}
              <div style={styles.messagesContainer}>
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    style={{
                      ...styles.messageRow,
                      ...(message.sender === "user" ? styles.userRow : styles.botRow)
                    }}
                  >
                    <div 
                      style={{
                        ...styles.messageBubble,
                        ...(message.sender === "user" ? styles.userBubble : styles.botBubble)
                      }}
                    >
                      <div style={styles.iconContainer}>
                        {message.sender === "user" ? 
                          <User size={16} /> : 
                          <Bot size={16} />
                        }
                      </div>
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Input Area */}
              <div style={styles.inputArea}>
                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    style={styles.input}
                  />
                  <button 
                    onClick={handleSendMessage}
                    style={styles.sendButton}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Login Required Message */
            <div style={styles.loginMessage}>
              <Bot size={48} color="#2563eb" />
              <h3 style={{ marginTop: '16px', color: '#1f2937' }}>Please login to chat</h3>
              <p style={{ color: '#6b7280', margin: '8px 0' }}>
                You must login to use the chat box. Please sign in to continue.
              </p>
              <button style={styles.loginButton} onClick={redirectToLogin}>
                <LogIn size={18} />
                Login Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}