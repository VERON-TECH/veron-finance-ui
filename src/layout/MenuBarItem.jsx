import { useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { modalActions } from "../store/modalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown, faArrowRightArrowLeft, faBank, faBuilding, faCalendarDay, faCalendarTimes, faCartPlus, faCashRegister, faCoins, faFileInvoice, faGlobe, faHome, faKey, faMinus, faMoneyBillTransfer, faPerson, faPersonArrowDownToLine, faPhoneAlt, faSave, faShop, faShoppingBag, faShoppingCart, faSquarePlus, faStore, faStoreAlt, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";




export default function MenuBarItem({ url, title, size = "w-4/25" }) {
  const dispatch = useDispatch();
  function handleClick() {
    dispatch(modalActions.update(title));

  }
  const className = `cursor-pointer flex justify-center items-center font-medium ${size} hover:border-b-4 focus:border-b-4 active:border-b-4`
  return <NavLink to={url} className={`({isActive})=>isActive ? ${className} : undefined`} onClick={handleClick}>
    {title === "Entreprise" && < FontAwesomeIcon icon={faBuilding} className="me-4" />}
    {title === "Agences" && < FontAwesomeIcon icon={faHome} className="me-4" />}
    {title === "Coffre-forts" && < FontAwesomeIcon icon={faCashRegister} className="me-4" />}
    {title === "Caisses" && < FontAwesomeIcon icon={faCoins} className="me-4" />}
    {title === "Banques" && < FontAwesomeIcon icon={faBank} className="me-4" />}
    {title === "Mobile Money" && < FontAwesomeIcon icon={faPhoneAlt} className="me-4" />}
    {title === "Magasins principaux" && < FontAwesomeIcon icon={faStoreAlt} className="me-4" />}
    {title === "Magasins sécondaires" && < FontAwesomeIcon icon={faStore} className="me-4" />}
    {title === "Bons de commande" && < FontAwesomeIcon icon={faShoppingCart} className="me-4" />}
    {title === "Personnels" && < FontAwesomeIcon icon={faPerson} className="me-4" />}
    {title === "Utilisateurs" && < FontAwesomeIcon icon={faUser} className="me-4" />}
    {title === "Produits & Services" && < FontAwesomeIcon icon={faGlobe} className="me-4" />}
    {title === "Dépenses" && < FontAwesomeIcon icon={faCartPlus} className="me-4" />}
    {title === "Budgets" && < FontAwesomeIcon icon={faCalendarTimes} className="me-4" />}
    {title === "Fournisseurs" && < FontAwesomeIcon icon={faPersonArrowDownToLine} className="me-4" />}
    {title === "Appro & Transferts" && < FontAwesomeIcon icon={faArrowCircleDown} className="me-4" />}
    {title === "Stock" && < FontAwesomeIcon icon={faSave} className="me-4" />}
    {title === "Emprunts & prêts" && < FontAwesomeIcon icon={faCoins} className="me-4" />}
    {title === "Ventes" && < FontAwesomeIcon icon={faShoppingBag} className="me-4" />}
    {title === "Clients" && < FontAwesomeIcon icon={faUserGroup} className="me-4" />}
    {title === "Factures" && < FontAwesomeIcon icon={faFileInvoice} className="me-4" />}
    {title === "Factures clients" && < FontAwesomeIcon icon={faFileInvoice} className="me-4" />}
    {title === "Factures fournisseurs" && < FontAwesomeIcon icon={faFileInvoice} className="me-4" />}
    {title === "Avances versées" && < FontAwesomeIcon icon={faMoneyBillTransfer} className="me-4" />}
    {title === "Opération de caisse" && < FontAwesomeIcon icon={faArrowRightArrowLeft} className="me-4" />}
    {title === "Manquants" && < FontAwesomeIcon icon={faMinus} className="me-4" />}
    {title === "Excédents" && < FontAwesomeIcon icon={faSquarePlus} className="me-4" />}
    {title === "Journalier" && < FontAwesomeIcon icon={faCalendarDay} className="me-4" />}
    {title === "Modifier le mot de passe" && < FontAwesomeIcon icon={faKey} className="me-4" />}
    {title}
  </NavLink >
}