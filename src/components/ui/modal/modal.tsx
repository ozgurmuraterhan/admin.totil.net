import React, { FC, useRef, useEffect } from "react";
import Portal from "@reach/portal";
import { motion, AnimatePresence } from "framer-motion";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import cn from "classnames";
import Scrollbar from "@components/ui/scrollbar";
import { fadeInOut } from "@utils/motion/fade-in-out";
import { zoomOutIn } from "@utils/motion/zoom-out-in";
import useOnClickOutside from "@utils/use-click-outside";
import { useModalAction } from "./modal.context";

type ModalProps = {
  open?: boolean;
  children?: React.ReactNode;
  rootClassName?: string;
  useBlurBackdrop?: boolean;
  containerClassName?: string;
  variant?: "center" | "bottom";
};
type DivElementRef = React.MutableRefObject<HTMLDivElement>;

// variant based classes for modal root, container & close btn
const rootClasses = {
  center: "p-5",
  bottom: "p-5 pb-0",
};
const containerClasses = {
  center: "h-auto max-h-full top-1/2 -translate-y-1/2 rounded-lg",
  bottom: "h-full max-h-70vh bottom-0 rounded-ts-2xl rounded-te-2xl",
};

const Modal: FC<ModalProps> = ({
  children,
  open,
  rootClassName,
  useBlurBackdrop,
  containerClassName,
  variant = "center",
}) => {
  const { closeModal } = useModalAction();
  const modalRootRef = useRef() as DivElementRef;
  const modalInnerRef = useRef() as DivElementRef;
  useOnClickOutside(modalInnerRef, () => closeModal());

  useEffect(() => {
    if (modalRootRef.current) {
      if (open) {
        disableBodyScroll(modalRootRef.current);
      } else {
        enableBodyScroll(modalRootRef.current);
      }
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [open]);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={modalRootRef}
            key="modal"
            initial="from"
            animate="to"
            exit="from"
            variants={fadeInOut(0.25)}
            className={cn(
              "modal-root fixed bg-dark bg-opacity-40 inset-0 z-50",
              useBlurBackdrop && "use-blur-backdrop",
              rootClasses[variant],
              rootClassName
            )}
          >
            <motion.div
              initial="from"
              animate="to"
              exit="from"
              variants={zoomOutIn()}
              className="relative w-full h-full"
            >
              <div
                ref={modalInnerRef}
                className={cn(
                  "w-full absolute start-1/2 transform ltr:-translate-x-1/2 rtl:translate-x-1/2 bg-light overflow-x-hidden shadow-xl",
                  containerClasses[variant],
                  containerClassName
                )}
              >
                <Scrollbar className="w-full h-full">{children}</Scrollbar>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Modal;
