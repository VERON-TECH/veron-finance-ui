
import { motion } from "framer-motion";
import LogoDark from "../../layout/LogoDark";

export default function ErrorPage() {
    return <>
        <LogoDark />
        <motion.div className="flex flex-col justify-center gap-10 absolute text-2xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" variants={{ visible: { y: [0, 100, 0, 100, 0], scale: 1.1 }, hidden: { y: 0, scale: 1 } }} initial="hidden" animate="visible" >
            Une erreur s'est produite
        </motion.div>

    </>
}