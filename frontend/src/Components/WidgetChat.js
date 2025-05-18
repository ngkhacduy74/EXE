import { useState } from 'react';
import { Send, User, Bot, MessageCircle, X } from 'lucide-react';

// Inline styles to avoid CSS conflicts
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
  }
};

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    
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
        </div>
      )}
    </div>
  );
}