import { AnimatePresence, cubicBezier, motion } from 'framer-motion';

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export function SendButton({ show, isStreaming, onClick }: SendButtonProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className="absolute flex justify-center items-center top-[24px] right-[24px] p-3 bg-gradient-to-r from-dragon-500 to-fire-500 hover:from-dragon-600 hover:to-fire-600 text-white rounded-xl w-[48px] h-[48px] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          transition={{ ease: customEasingFn, duration: 0.17 }}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          onClick={(event) => {
            event.preventDefault();
            onClick?.(event);
          }}
        >
          <div className="text-xl">
            {!isStreaming ? (
              <div className="i-ph:paper-plane-tilt-bold"></div>
            ) : (
              <div className="i-ph:stop-circle-bold"></div>
            )}
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}