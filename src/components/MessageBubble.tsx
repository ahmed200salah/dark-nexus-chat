import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.type === 'human';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-lg backdrop-blur-sm ${
          isUser
            ? 'bg-secondary text-foreground border border-primary/20'
            : 'bg-card text-foreground border border-border'
        }`}
      >
        {isUser ? (
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                code: ({ className, children }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-accent">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-3 mt-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold mb-2 mt-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-2">{children}</h3>,
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MessageBubble;
