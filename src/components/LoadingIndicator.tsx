import { motion } from 'framer-motion';

const LoadingIndicator = () => {
  const dotVariants = {
    initial: { y: 0, opacity: 0.4 },
    animate: { y: [-8, 0, -8], opacity: [0.4, 1, 0.4] }
  };

  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex gap-1">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay
            }}
            className="w-2.5 h-2.5 bg-primary rounded-full"
          />
        ))}
      </div>
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground"
      >
        AI is thinking...
      </motion.span>
    </div>
  );
};

export default LoadingIndicator;
