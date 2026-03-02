
import { motion } from "framer-motion";
import LogoDark from "../../layout/LogoDark";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

export default function ErrorPage() {
    return <div className="w-screen h-screen bg-sky-950/50">
        <LogoDark />
        <motion.div className="bg-sky-950 text-sky-50 rounded px-5 py-2 shadow-md shadow-sky-950 flex justify-center gap-10 absolute text-2xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" variants={{ visible: { y: [0, 100, 0, 100, 0], scale: 1.1 }, hidden: { y: 0, scale: 1 } }} initial="hidden" animate="visible" >
            <FontAwesomeIcon icon={faExclamation} className="me-2 bg-sky-50 text-sky-950" />Une erreur s'est produite
        </motion.div>
        <Footer font="bg-sky-950 text-sky-50 font-medium" />

    </div>
}