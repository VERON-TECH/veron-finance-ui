import { useFormStatus } from "react-dom"
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faAngleDoubleDown, faArrowCircleRight, faBank, faBox, faCheckDouble, faCircleCheck, faCirclePlus, faCoins, faDeleteLeft, faDiagramNext, faDiagramPredecessor, faEraser, faFileCircleCheck, faFloppyDisk, faFolderOpen, faGroupArrowsRotate, faList, faListCheck, faPersonArrowDownToLine, faPrint, faSpinner, faSquarePhone, faStoreAlt, faStoreAltSlash, faTrashArrowUp, faUserGear, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faCheckSquare, faWindowRestore } from "@fortawesome/free-regular-svg-icons";
import { faCashApp } from "@fortawesome/free-brands-svg-icons";




export default function Submit({ children, disabled = false, className, ...props }) {

  const { pending } = useFormStatus();

  return <div className={`flex justify-center ${className}`}>
    <motion.button className="cursor-pointer border bg-sky-950 text-sky-50 rounded px-5 py-1" {...props} whileHover={{ scale: 1.1 }} disabled={disabled} >
      {children === "Nouveau" || children === "Créer" ? <FontAwesomeIcon icon={faCirclePlus} className="me-2" /> : undefined}
      {children === "Enregistrer" ? <FontAwesomeIcon icon={faFloppyDisk} className="me-2" /> : undefined}
      {children === "Autoriser" ? <FontAwesomeIcon icon={faFileCircleCheck} className="me-2" /> : undefined}
      {children === "Gestion des affectations" ? <FontAwesomeIcon icon={faAngleDoubleDown} className="me-2" /> : undefined}
      {children === "Valider" ? <FontAwesomeIcon icon={faCircleCheck} className="me-2" /> : undefined}
      {children === "Validé" ? <FontAwesomeIcon icon={faCheckDouble} className="me-2" /> : undefined}
      {children === "Inactif" ? <FontAwesomeIcon icon={faDeleteLeft} className="me-2" /> : undefined}
      {children === "Valider tout" ? <FontAwesomeIcon icon={faListCheck} className="me-2" /> : undefined}
      {children === "Nettoyer tout" ? <FontAwesomeIcon icon={faEraser} className="me-2" /> : undefined}
      {children === "Annuler" ? <FontAwesomeIcon icon={faEraser} className="me-2" /> : undefined}
      {children === "Ouvrir" ? <FontAwesomeIcon icon={faFolderOpen} className="me-2" /> : undefined}
      {children === "Réinitialiser" ? <FontAwesomeIcon icon={faWindowRestore} className="me-2" /> : undefined}
      {children === "Imprimer" ? <FontAwesomeIcon icon={faPrint} className="me-2" /> : undefined}
      {children === "Inventaires" ? <FontAwesomeIcon icon={faStoreAlt} className="me-2" /> : undefined}
      {children === "Banques" && < FontAwesomeIcon icon={faBank} className="me-2" />}
      {children === "Opérateurs" && < FontAwesomeIcon icon={faSquarePhone} className="me-2" />}
      {children === "Fonctions" && < FontAwesomeIcon icon={faPersonArrowDownToLine} className="me-2" />}
      {children.includes("Reste à payer") ? <FontAwesomeIcon icon={faCoins} className="me-2" /> : undefined}
      {children.includes("Agences autorisées") || children.includes("Caisses autorisées") || children.includes("Entreprises autorisées") || children.includes("Magasins autorisés") ? <FontAwesomeIcon icon={faFileCircleCheck} className="me-2" /> : undefined}
      {children === "Attribuer un rôle" && < FontAwesomeIcon icon={faUserGroup} className="me-2" />}
      {children === "Caisses & Magasins" && < FontAwesomeIcon icon={faUserGear} className="me-2" />}
      {children === "Catégories de service" && < FontAwesomeIcon icon={faGroupArrowsRotate} className="me-2" />}
      {children === "Famille de dépenses" && < FontAwesomeIcon icon={faCashApp} className="me-2" />}
      {children === "Ajouter" && < FontAwesomeIcon icon={faAdd} className="me-2" />}
      {children === "Fournitures" && < FontAwesomeIcon icon={faArrowCircleRight} className="me-2" />}
      {children === "Rébuts" && < FontAwesomeIcon icon={faTrashArrowUp} className="me-2" />}
      {children === "Paquets" && < FontAwesomeIcon icon={faBox} className="me-2" />}
      {children === "Régler" && < FontAwesomeIcon icon={faCoins} className="me-2" />}
      {children === "Rapport" && < FontAwesomeIcon icon={faDiagramPredecessor} className="me-2" />}
      {children === "Appliquer" && < FontAwesomeIcon icon={faCheckSquare} className="me-2" />}
      {children === "Duplicata" && < FontAwesomeIcon icon={faPrint} className="me-2" />}
      {children === "Listing des opérations" && < FontAwesomeIcon icon={faList} className="me-2" />}
      {children === "Rapport d'activité" && < FontAwesomeIcon icon={faDiagramNext} className="me-2" />}



      {pending ? <div className="flex gap-2">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        <span>En cours...</span>
      </div> : children}
    </motion.button>

  </div>

}