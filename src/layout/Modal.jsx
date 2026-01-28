import { useEffect, useImperativeHandle, useRef } from "react"
import { createPortal } from "react-dom";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useDragControls } from "framer-motion";
import { useSelector } from "react-redux";


export default function Modal({ title, children, ref, size = "w-1/5 h-1/6" }) {

  const dialog = useRef();
  const controls = useDragControls(); // ✅ contrôleur de drag
  const close = useSelector(state => state.modal.close)

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      }
    }
  })


  function handleClose() {
    dialog.current.close();
  }

  useEffect(() => {
    dialog.current.close();
  }, [close])

  return createPortal(
    <motion.dialog
      ref={dialog}
      drag
      dragListener={false} // ❌ pas de drag global
      dragControls={controls} // ✅ drag contrôlé
      dragMomentum={false}
      whileDrag={{
        scale: 1.05,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.3)"
      }}
      className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop:bg-sky-50/20 border rounded shadow-lg shadow-sky-950/50 ${size}`}
      variants={{
        hidden: { opacity: 0, y: -500 },
        visible: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
    >
      <header
        className="flex justify-between p-2 bg-sky-950 text-sky-50 font-medium cursor-move"
        onPointerDown={(e) => controls.start(e)} // ✅ seul le header déclenche le drag
      >
        <span>{title}</span>
        <button onClick={handleClose} className="cursor-pointer">
          <FontAwesomeIcon icon={faClose} />
        </button>
      </header>
      <main className="p-4">
        {children}
      </main>
    </motion.dialog>,
    document.querySelector("#modal")
  )
}
