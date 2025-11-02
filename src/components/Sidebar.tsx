import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MessageSquare, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Conversation } from '@/types/chat';

interface SidebarProps {
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectConversation: (sessionId: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({
  currentSessionId,
  onNewChat,
  onSelectConversation,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('session_id, message, created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const conversationMap = new Map<string, Conversation>();
      
      data?.forEach((row: any) => {
        if (!conversationMap.has(row.session_id) && row.message?.type === 'human') {
          const title = row.message.content.slice(0, 100);
          conversationMap.set(row.session_id, {
            session_id: row.session_id,
            title,
            created_at: row.created_at,
          });
        }
      });

      setConversations(Array.from(conversationMap.values()).reverse());
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: isCollapsed ? 64 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative h-screen bg-card/95 backdrop-blur-md border-r border-border shadow-2xl"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </motion.div>
                  <span className="font-semibold text-sm">Bankruptcy Law</span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hover:bg-accent"
              >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>
            </motion.div>
          </div>

          {/* New Chat Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onNewChat}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-2 shadow-lg"
            >
              <PlusCircle className="h-5 w-5" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    محادثة جديدة
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 px-2">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 pb-4"
              >
                {conversations.map((conv, index) => (
                  <motion.button
                    key={conv.session_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectConversation(conv.session_id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentSessionId === conv.session_id
                        ? 'bg-accent text-accent-foreground shadow-md'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-1 shrink-0" />
                      <span className="text-sm line-clamp-2">{conv.title}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 pb-4"
              >
                {conversations.map((conv, index) => (
                  <motion.button
                    key={conv.session_id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSelectConversation(conv.session_id)}
                    className={`w-full p-3 rounded-lg transition-colors ${
                      currentSessionId === conv.session_id
                        ? 'bg-accent text-accent-foreground shadow-md'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <MessageSquare className="h-5 w-5 mx-auto" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
