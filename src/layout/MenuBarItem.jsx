import { useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { modalActions } from "../store/modalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown, faBank, faBuilding, faCalendarTimes, faCartPlus, faCashRegister, faCoins, faGlobe, faHome, faPerson, faPersonArrowDownToLine, faPhoneAlt, faSave, faShop, faShoppingCart, faStore, faStoreAlt, faUser } from "@fortawesome/free-solid-svg-icons";




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
    {title}
  </NavLink >
}