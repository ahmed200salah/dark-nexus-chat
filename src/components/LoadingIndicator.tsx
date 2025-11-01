const LoadingIndicator = () => {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <span className="text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  );
};

export default LoadingIndicator;
