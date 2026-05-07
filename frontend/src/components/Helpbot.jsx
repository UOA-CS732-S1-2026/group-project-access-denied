import { useState, useRef, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#994127',
            opacity: 0.6,
            animation: `helpbot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function HelpBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Hi! I\'m HelpBot. Ask me anything about the Access Denied platform — challenges, scoring, or how to submit flags.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [sessionId, setSessionId] = useState(
  () => sessionStorage.getItem('helpbot_session')
    ? parseInt(sessionStorage.getItem('helpbot_session'))
    : null
);
  
const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text }),
      });

      const data = await res.json();

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        sessionStorage.setItem('helpbot_session', data.sessionId);
      }

      setMessages(prev => [...prev, {
        role: 'model',
        content: data.reply || 'Something went wrong.',
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'model',
        content: 'Sorry, I\'m having trouble connecting. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes helpbot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes helpbot-fade-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .helpbot-input::placeholder { color: #89726c; opacity: 0.7; }
        .helpbot-input:focus { outline: none; }
      `}</style>

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle HelpBot"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 1000,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #994127, #b8583d)',
          boxShadow: '0 20px 40px rgba(86,66,61,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? (
          // Close icon
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M16 4L4 16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          // Chat icon
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 28,
            zIndex: 999,
            width: 360,
            maxHeight: 520,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'rgba(252, 249, 248, 0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(86,66,61,0.10)',
            animation: 'helpbot-fade-in 0.22s ease',
            fontFamily: 'Manrope, Arial, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, #994127, #b8583d)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>
                HelpBot
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
                Access Denied Support
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '9px 13px',
                    borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    background: isUser
                      ? 'linear-gradient(135deg, #994127, #b8583d)'
                      : '#ffffff',
                    color: isUser ? '#fff' : '#1c1b1b',
                    fontSize: 13,
                    lineHeight: 1.5,
                    boxShadow: '0 2px 8px rgba(86,66,61,0.06)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '12px 12px 12px 4px',
                  boxShadow: '0 2px 8px rgba(86,66,61,0.06)',
                }}>
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 14px',
            background: '#f6f3f2',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-end',
          }}>
            <textarea
              className="helpbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              rows={1}
              style={{
                flex: 1,
                resize: 'none',
                border: 'none',
                borderBottom: '1.5px solid #994127',
                background: '#ffffff',
                borderRadius: '4px 4px 0 0',
                padding: '9px 11px',
                fontSize: 13,
                fontFamily: 'Manrope, Arial, sans-serif',
                color: '#1c1b1b',
                lineHeight: 1.5,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                flexShrink: 0,
                padding: '9px 14px',
                border: 'none',
                borderRadius: 4,
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #994127, #b8583d)'
                  : '#dcc1ba',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Manrope, Arial, sans-serif',
                transition: 'background 0.2s',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}