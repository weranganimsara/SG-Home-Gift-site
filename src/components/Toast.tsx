import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-strong flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-2xl"
            role="status"
          >
            <span className="text-[#FFA54A]">✓</span>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
