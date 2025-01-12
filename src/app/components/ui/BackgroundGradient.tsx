// components/ui/BackgroundGradient.tsx
import { motion } from 'framer-motion';

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
}

export const BackgroundGradient = ({ children, className = "" }: BackgroundGradientProps) => {
  return (
    <div className={`relative group p-[1px] ${className}`}>
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};