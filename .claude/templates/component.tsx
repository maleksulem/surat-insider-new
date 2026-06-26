import { motion } from "motion/react";

export const ComponentTemplate = ({ title }: { title: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
    >
      <h2 className="text-xl font-medium tracking-tight text-white">{title}</h2>
    </motion.div>
  );
};
