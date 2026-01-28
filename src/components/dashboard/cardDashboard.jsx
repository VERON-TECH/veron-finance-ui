import { faArrowAltCircleRight, faCoins, faPersonArrowDownToLine, faProjectDiagram, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CardDashboard({ title, detail }) {
  const navigate = useNavigate()

  function handleNavigate(selection) {
    switch (selection) {
      case "Bénéficiaires":
        navigate("beneficiary")
        break;

      case "Segments":
        navigate("/home/project")
        break;

      case "Segments alloués":
        navigate("/home/finance")
        break;

      case "Utilisateurs":
        navigate("/home/users")
        break;

      case "Utilisateurs connectés":
        navigate("/home/users")
        break;
    }
  }
  return <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 1 }} className="flex flex-col bg-sky-950 text-sky-50 w-1/5 h-32 rounded-xl border border-sky-950 p-2">
    <header className="flex-1/5 bg-sky-50 text-sky-950 rounded text-center font-bold mb-1">
      {title === "Bénéficiaires" && <FontAwesomeIcon icon={faPersonArrowDownToLine} className="me-2" />}
      {title === "Segments" && <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />}
      {title === "Segments alloués" && <FontAwesomeIcon icon={faCoins} className="me-2" />}
      {title === "Utilisateurs" || title === "Utilisateurs connectés" ? <FontAwesomeIcon icon={faUserGroup} className="me-2" /> : undefined}

      {title}
    </header>
    <div className="text-2xl flex flex-3/5 bg-sky-950 text-sky-50 rounded text-center font-bold mb-1 border justify-center items-center">
      {isNaN(detail) ? 0 : parseFloat(detail)?.toLocaleString()}
    </div>
    <footer className="flex-1/5 bg-sky-50 text-sky-950 rounded text-center font-bold py-1">
      <button className="cursor-pointer bg-sky-950 text-sky-50 rounded px-5" onClick={() => handleNavigate(title)}>Détails<FontAwesomeIcon className="ms-2" icon={faArrowAltCircleRight} /></button>
    </footer>
  </motion.div>
}