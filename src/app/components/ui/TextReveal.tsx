import { motion } from 'framer-motion';

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
}

export const TextReveal = ({ children, className = "" }: TextRevealProps) => {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};