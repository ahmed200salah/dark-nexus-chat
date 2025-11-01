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
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
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
        <div className="p-4">
          <Button
            onClick={onNewChat}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            {!isCollapsed && <span>New Chat</span>}
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
