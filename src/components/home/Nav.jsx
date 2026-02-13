import { NavLink } from "react-router";
import Logo from "../../layout/Logo";
import { features } from "../../data/menu.js";
import { faArchive, faArrowRightArrowLeft, faCartShopping, faDashboard, faHome, faMoneyBill, faMoneyBillTrendUp, faProjectDiagram, faShop, faStore, faToolbox, faUserGroup, faUserLarge, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import useMenu from "../../hooks/useMenu";
import { useDispatch } from "react-redux";
import { identifierMenuActions } from "../../store/identifierSlice";



export default function Nav() {
  const inactive = "bg-sky-950 text-sky-50 rounded"
  const active = "bg-sky-50 text-sky-950 p-2 rounded"
  const dispatch = useDispatch();

  const { data } = useMenu(features)

  function handleClick(menu) {
    dispatch(identifierMenuActions.updateMenu({ menu }))
  }

  return <motion.nav className="bg-sky-950 text-sky-50 w-2/15 h-screen fixed left-0" layout >
    <Logo size="w-64" position="absolute left-1/2 transform -translate-x-1/2" />
    <motion.ul className="absolute top-35 p-4 flex flex-col gap-10" variants={{ visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -100 } }} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 3, type: "spring", bounce: 0.5, staggerChildren: 0.05 }}>
      {data.map(feature =>
        <motion.li initial="hidden" animate="visible" exit="hidden" key={feature.key}>
          <NavLink
            to={feature.path}
            className={({ isActive }) => isActive ? active : inactive}
            end
            onClick={() => handleClick(feature.menu)}
          >
            {feature.menu === "Administration" && <FontAwesomeIcon icon={faHome} className="me-2" />}
            {feature.menu === "Finances" && <FontAwesomeIcon icon={faMoneyBill} className="me-2" />}
            {feature.menu === "Ressources Humaines" && <FontAwesomeIcon icon={faUserGroup} className="me-2" />}
            {feature.menu === "Moyens Généraux" && <FontAwesomeIcon icon={faArchive} className="me-2" />}
            {feature.menu === "Dashboard" && <FontAwesomeIcon icon={faDashboard} className="me-2" />}
            {feature.menu === "Caisses" && <FontAwesomeIcon icon={faWallet} className="me-2" />}
            {feature.menu === "Magasins & Stocks" && <FontAwesomeIcon icon={faStore} className="me-2" />}
            {feature.menu === "Appro & transferts" && <FontAwesomeIcon icon={faArrowRightArrowLeft} className="me-2" />}
            {feature.menu === "Autres réglages" && <FontAwesomeIcon icon={faToolbox} className="me-2" />}
            {feature.menu === "Base de données" && <FontAwesomeIcon icon={faDatabase} className="me-2" />}
            {feature.menu === "Gestion Budgétaire" && <FontAwesomeIcon icon={faMoneyBillTrendUp} className="me-2" />}
            {feature.menu === "Engagements" && <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />}
            {feature.menu === "Ventes" && <FontAwesomeIcon icon={faCartShopping} className="me-2" />}
            {feature.menu}
          </NavLink>

        </motion.li>
      )}
    </motion.ul>

  </motion.nav >
}