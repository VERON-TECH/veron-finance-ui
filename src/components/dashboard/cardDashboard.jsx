import { faArrowRight, faArrowRightArrowLeft, faBank, faBook, faBookOpen, faBuilding, faBuildingShield, faChalkboardTeacher, faCoins, faFireAlt, faGripVertical, faHome, faMinus, faMobile, faPlus, faSchoolCircleCheck, faStore, faTimes, faTimesCircle, faUserCircle, faUserGroup, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"

export default function CardDashboard({ title, balance = 0, account, actif }) {
  const navigate = useNavigate()

  function handleclick() {
    switch (title) {
      case "Année scolaire":
        navigate("/home/period")
        break;

      case "Etablissement":
        navigate("/home")
        break;
      case "Classes":
        navigate("/home/classe")
        break;
      case "Cours":
        navigate("/home/course")
        break;

      case "Département":
        navigate("/home/department")
        break;

      case "Enseignement":
        navigate("/home/education")
        break;

      case "Emploi du temps":
        navigate("/home/time-table")
        break;

      case "Bulletin de notes":
        navigate("/home/school-report")
        break;

      case "Banques":
        navigate("/home/bank")
        break;

      case "Caisses":
        navigate("/home/cash-config")
        break;

      case "Mobile Money":
        navigate("/home/mobile-money")
        break;

      case "Rémunérations mensuelles":
        navigate("/home/monthly-remuneration")
        break;

      case "Inscriptions":
        navigate("/home/registration")
        break;

      case "Manquants":
        navigate("/home/incidence-cash")
        break;

      case "Excédents":
        navigate("/home/incidence-cash/surplus-cash")
        break;

      case "Opération de caisse":
        navigate("/home/reporting-cash")
        break;

      case "Budgets disponibles":
        navigate("/home/budget")
        break;

      case "Employés":
        navigate("/home/personal")
        break;

      case "Utilisateurs":
        navigate("/home/user")
        break;

      case "Elèves":
        navigate("/home/student")
        break;

      case "Parents":
        navigate("/home/parents")
        break;

      case "Sanctions":
        navigate("/home/sanction")
        break;

      case "Magasins":
        navigate("/home/stock")
        break;

      case "Fournitures":
        navigate("/home/school-supplier")
        break;

    }
  }
  return <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col bg-sky-950 text-sky-50 border border-sky-50 rounded-xl shadow-xl shadow-sky-950 w-1/5 h-32">
    <header className="h-1/5 text-center bg-white text-sky-950 font-bold border-4 rounded-xl"><FontAwesomeIcon icon={title === "Etablissement" ? faBuilding : title === "Classes" ? faHome : title === "Cours" ? faBook : title === "Département" ? faBuildingShield : title === "Enseignement" ? faChalkboardTeacher : title === "Emploi du temps" ? faTimes : title === "Bulletin de notes" ? faBookOpen : title === "Banques" ? faBank : title === "Caisses" ? faCoins : title === "Mobile Money" ? faMobile : title === "Année scolaire" ? faTimesCircle : title === "Rémunérations mensuelles" ? faWallet : title === "Inscriptions" ? faArrowRightArrowLeft : title === "Manquants" ? faMinus : title === "Excédents" ? faPlus : title === "Opération de caisse" ? faArrowRightArrowLeft : title === "Budgets disponibles" ? faWallet : title === "Employés" ? faUserGroup : title === "Utilisateurs" ? faUserCircle : title === "Elèves" ? faSchoolCircleCheck : title === "Parents" ? faUserGroup : title === "Sanctions" ? faFireAlt : title === "Magasins" ? faStore : title === "Fournitures" ? faGripVertical : undefined} className="me-2" /><span>{title}</span></header>
    <div className="flex h-1/5 text-sky-50 font-bold text-lg text-center justify-center items-center">{account}</div>
    <div className="flex h-2/5 text-sky-50 font-bold text-lg text-center justify-center items-center">{balance.toLocaleString()}</div>
    <div className="flex h-2/5 text-sky-50 font-bold text-lg text-center justify-center items-center">{actif}</div>
    <button className="h-1/5 text-center bg-white text-sky-950 font-bold border-4 rounded-xl cursor-pointer" onClick={handleclick}><span className="me-2">Détails</span><FontAwesomeIcon icon={faArrowRight} /></button>
  </motion.div>
}