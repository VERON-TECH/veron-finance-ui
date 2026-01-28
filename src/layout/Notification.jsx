import { motion } from "framer-motion"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { noteActions } from "../store/noteSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faThumbsUp } from "@fortawesome/free-solid-svg-icons";



export default function Notification({ messages, error }) {
  const view = useSelector(state => state.note.visible)
  const dispatch = useDispatch();
  useEffect(() => {
    let timer = setInterval(() => {
      if (view === "absolute") {
        dispatch(noteActions.hide());
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    }
  }, [])
  return <motion.div className={`flex ${error ? "bg-red-200 text-red-500" : "bg-sky-200 text-sky-950"}  ${view} p-4 rounded m-4 w-72 right-5 top-1 font-medium`} initial={{ y: -30, opacity: 1 }} animate={{ y: 30, opacity: 0.75 }} transition={{ duration: 1, type: "spring", bounce: 0.75 }} exit={{ y: -30, opacity: 1 }}>
    <div>
      {messages.map(message => (
        <div key={message} className="mb-2"><FontAwesomeIcon icon={error ? faInfoCircle : faThumbsUp} className="me-2" />{message}</div>
      ))}
    </div>

  </motion.div>
}

