import { useEffect, useState } from 'react';
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
    <div
      className={`relative h-screen bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <span className="font-semibold text-sm">Bankruptcy Law</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="hover:bg-accent"
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={onNewChat}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            {!isCollapsed && <span>محادثة جديدة</span>}
          </Button>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 px-2">
          {!isCollapsed ? (
            <div className="space-y-2 pb-4">
              {conversations.map((conv) => (
                <button
                  key={conv.session_id}
                  onClick={() => onSelectConversation(conv.session_id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentSessionId === conv.session_id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-1 shrink-0" />
                    <span className="text-sm line-clamp-2">{conv.title}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {conversations.map((conv) => (
                <button
                  key={conv.session_id}
                  onClick={() => onSelectConversation(conv.session_id)}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    currentSessionId === conv.session_id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <MessageSquare className="h-5 w-5 mx-auto" />
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
