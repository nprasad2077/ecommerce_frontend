import { motion } from "framer-motion";
import { defaultMotionTransition } from "../utils/animationConfig";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={defaultMotionTransition} 
    >
      {children}
    </motion.div>
  );
}
