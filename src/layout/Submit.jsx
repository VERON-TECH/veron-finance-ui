import { useFormStatus } from "react-dom"
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faAngleDoubleDown, faBank, faCircleCheck, faCirclePlus, faCoins, faFileCircleCheck, faFloppyDisk, faFolderOpen, faGraduationCap, faListCheck, faPrint, faSpinner, faSquarePhone, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faWindowRestore } from "@fortawesome/free-regular-svg-icons";



export default function Submit({ children, disabled = false, ...props }) {

  const { pending } = useFormStatus();

  return <div className="flex justify-center">
    <motion.button className="cursor-pointer border bg-sky-950 text-sky-50 rounded px-5 py-1" {...props} whileHover={{ scale: 1.1 }} disabled={disabled} >
      {children === "Nouveau" || children === "Créer" ? <FontAwesomeIcon icon={faCirclePlus} className="me-2" /> : undefined}
      {children === "Enregistrer" ? <FontAwesomeIcon icon={faFloppyDisk} className="me-2" /> : undefined}
      {children === "Autoriser" ? <FontAwesomeIcon icon={faFileCircleCheck} className="me-2" /> : undefined}
      {children === "Affecter" ? <FontAwesomeIcon icon={faAngleDoubleDown} className="me-2" /> : undefined}
      {children === "Valider" ? <FontAwesomeIcon icon={faCircleCheck} className="me-2" /> : undefined}
      {children === "Valider tout" ? <FontAwesomeIcon icon={faListCheck} className="me-2" /> : undefined}
      {children === "Nouvel élève" ? <FontAwesomeIcon icon={faGraduationCap} className="me-2" /> : undefined}
      {children === "Ouvrir" ? <FontAwesomeIcon icon={faFolderOpen} className="me-2" /> : undefined}
      {children === "Réinitialiser" ? <FontAwesomeIcon icon={faWindowRestore} className="me-2" /> : undefined}
      {children === "Créer un élève" ? <FontAwesomeIcon icon={faUserGroup} className="me-2" /> : undefined}
      {children === "Imprimer" ? <FontAwesomeIcon icon={faPrint} className="me-2" /> : undefined}
      {children === "Banques" && < FontAwesomeIcon icon={faBank} className="me-2" />}
      {children === "Opérateurs" && < FontAwesomeIcon icon={faSquarePhone} className="me-2" />}
      {children.includes("Reste à payer") ? <FontAwesomeIcon icon={faCoins} className="me-2" /> : undefined}
      {children.includes("Liste des bénéficiaires") || children.includes("Liste des segments") ? <FontAwesomeIcon icon={faListCheck} className="me-2" /> : undefined}
      {children.includes("Ajouter un bénéficiaire") ? <FontAwesomeIcon icon={faAdd} className="me-2" /> : undefined}

      {pending ? <div className="flex gap-2">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        <span>En cours...</span>
      </div> : children}
    </motion.button>

  </div>

}