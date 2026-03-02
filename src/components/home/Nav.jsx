import { NavLink } from "react-router";
import Logo from "../../layout/Logo";
import { features } from "../../data/menu.js";
import { faArchive, faArrowRightArrowLeft, faBank, faCartShopping, faDashboard, faHome, faKey, faMoneyBill, faMoneyBillTrendUp, faProjectDiagram, faShop, faStore, faToolbox, faUserGroup, faUserLarge, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import useMenu from "../../hooks/useMenu";
import { useDispatch } from "react-redux";
import { identifierMenuActions } from "../../store/identifierSlice";
import { useEffect, useState } from "react";
import { getAllCashes, getAllSales, getCashBySlug } from "../../utils/http.js";



export default function Nav() {
  const inactive = "bg-sky-950 text-sky-50 rounded"
  const active = "bg-sky-50 text-sky-950 p-2 rounded"
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"))
  const [item, setItem] = useState({
    sales: 0,
    balance: {
      cash: 0,
      bank: 0,
      mobile: 0
    },
  })

  const { data } = useMenu(features)

  function handleClick(menu) {
    dispatch(identifierMenuActions.updateMenu({ menu }))
  }

  useEffect(() => {
    async function get(signal) {
      let cashes = []
      let balance = {
        cash: 0,
        bank: 0,
        mobile: 0
      }
      let cash = {}
      if (user.role.includes("ROLE_CAISSIER")) {
        for (let c of user.cashes) {
          cash = await getCashBySlug({ slug: c.value, signal })
          balance.cash += cash.balance
          cashes.push(c.value)
        }
      } else if (user.role.includes("ROLE_CHEF_CAISSIER") || user.role.includes("ROLE_COMPTABLE")) {
        const allCashes = await getAllCashes({ signal, enterprise: user.enterprise, agency: user.agency })
        for (let c of allCashes) {
          cash = await getCashBySlug({ slug: c.slug, signal })
          balance.cash += cash.balance
          cashes.push(c.value)
        }
      }

      const allSales = await getAllSales({ signal, enterprise: user.enterprise, agency: user.agency, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString(), cashes, customer: 0 })
      let sales = 0
      allSales.forEach(s => {
        sales += s.priceTtc
      })
      setItem(prev => {
        return {
          ...prev,
          sales,
          balance

        }
      })
    }
    get()

  }, [])

  return <motion.nav className="bg-sky-950 text-sky-50 w-3/17 h-screen fixed left-0" layout >
    <Logo size="w-64" position="absolute left-1/2 transform -translate-x-1/2" />
    <motion.ul className="absolute top-35 p-4 flex flex-col gap-8" variants={{ visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -100 } }} initial="hidden" animate="visible" exit="hidden" transition={{ duration: 3, type: "spring", bounce: 0.5, staggerChildren: 0.05 }}>
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
            {feature.menu.includes("Caisses") && <FontAwesomeIcon icon={faWallet} className="me-2" />}
            {feature.menu === "Magasins & Stocks" && <FontAwesomeIcon icon={faStore} className="me-2" />}
            {feature.menu === "Appro & transferts" && <FontAwesomeIcon icon={faArrowRightArrowLeft} className="me-2" />}
            {feature.menu === "Banques" && <FontAwesomeIcon icon={faBank} className="me-2" />}

            {feature.menu === "Autres réglages" && <FontAwesomeIcon icon={faToolbox} className="me-2" />}
            {feature.menu === "Données" && <FontAwesomeIcon icon={faDatabase} className="me-2" />}
            {feature.menu === "Gestion Budgétaire" && <FontAwesomeIcon icon={faMoneyBillTrendUp} className="me-2" />}

            {feature.menu === "Engagements" && <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />}
            {feature.menu.includes("Ventes") && <FontAwesomeIcon icon={faCartShopping} className="me-2" />}
            {feature.menu === "Mot de passe" && <FontAwesomeIcon icon={faKey} className="me-2" />}
            {feature.menu.includes("Ventes") ? <><span className="me-4">Ventes</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.sales).toLocaleString()}</span></> :
              feature.menu.includes("Caisse") ? <><span className="me-4">Caisses</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.balance.cash).toLocaleString()}</span></> :
                feature.menu}
          </NavLink>

        </motion.li>
      )}
    </motion.ul>

  </motion.nav >
}