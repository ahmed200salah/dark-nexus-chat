import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.form 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      className="border-t border-border bg-card/95 backdrop-blur-md p-6 shadow-2xl"
    >
      <div className="flex gap-4 items-end max-w-4xl mx-auto">
        <motion.div 
          className="flex-1"
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب سؤالك هنا... | Type your legal question here..."
            disabled={disabled}
            className="min-h-[56px] max-h-[200px] resize-none bg-background/50 border-border focus:border-primary focus:bg-background focus:shadow-lg transition-all rounded-xl"
            rows={1}
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            size="icon"
            className="h-[56px] w-[56px] shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl rounded-xl"
          >
            <motion.div
              animate={message.trim() ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5, repeat: message.trim() ? Infinity : 0, repeatDelay: 2 }}
            >
              <Send className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default ChatInput;
