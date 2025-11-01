import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { Message, AgentRequest } from '@/types/chat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import Sidebar from './Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: any) => {
          const newMessage = payload.new;
          if (newMessage.session_id === sessionId && newMessage.message) {
            const message: Message = {
              id: newMessage.id,
              type: newMessage.message.type,
              content: newMessage.message.content,
              created_at: newMessage.created_at,
            };
            
            if (message.type === 'ai') {
              setIsLoading(false);
            }
            
            setMessages((prev) => [...prev, message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      type: 'human',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const agentRequest: AgentRequest = {
      query: content,
      user_id: 'NA',
      request_id: uuidv4(),
      session_id: sessionId,
    };

    try {
      const response = await fetch('http://localhost:8001/api/pydantic-Law-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(uuidv4());
    setIsLoading(false);
  };

  const handleSelectConversation = async (selectedSessionId: string) => {
    setMessages([]);
    setSessionId(selectedSessionId);
    setIsLoading(false);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', selectedSessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const loadedMessages: Message[] = data.map((row: any) => ({
        id: row.id,
        type: row.message.type,
        content: row.message.content,
        created_at: row.created_at,
      }));

      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar
        currentSessionId={sessionId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">
            {messages.length > 0 ? messages[0]?.content.slice(0, 50) + '...' : 'New Chat'}
          </h1>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-6">
          <div className="max-w-5xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-card border border-border rounded-2xl">
                  <LoadingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
