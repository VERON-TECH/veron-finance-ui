import MenuBarItem from "../../layout/MenuBarItem";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import useSub from "../../hooks/useSub";

export default function MenuBar({ size, features }) {
  const menu = useSelector(state => state.identifier.menu)
  const { data } = useSub(menu, features)

  return <motion.div className="bg-sky-950 text-sky-50 flex gap-10 rounded h-2/30 p-2 mb-4" variants={{ visible: { y: 0 }, hidden: { y: -100 } }} initial="hidden" animate="visible" transition={{ duration: 1 }} >
    {
      data.map(subFeature => <MenuBarItem key={subFeature.key} url={subFeature.url} title={subFeature.menu} size={size} />)
    }

  </motion.div >
}