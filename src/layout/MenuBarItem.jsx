import { useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { modalActions } from "../store/modalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBank, faBuilding, faCoins, faHome, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";


export default function MenuBarItem({ url, title, size = "w-3/25" }) {
  const dispatch = useDispatch();
  function handleClick() {
    dispatch(modalActions.update(title));
  }
  const className = `cursor-pointer flex justify-center items-center font-medium ${size} hover:border-b-4 focus:border-b-4 active:border-b-4`
  return <NavLink to={url} className={`({isActive})=>isActive ? ${className} : undefined`} onClick={handleClick}>
    {title === "Entreprise" && < FontAwesomeIcon icon={faHome} className="me-4" />}
    {title === "Agences" && < FontAwesomeIcon icon={faBuilding} className="me-4" />}
    {title === "Coffre-forts" && < FontAwesomeIcon icon={faBuilding} className="me-4" />}
    {title === "Caisses" && < FontAwesomeIcon icon={faCoins} className="me-4" />}
    {title === "Banques" && < FontAwesomeIcon icon={faBank} className="me-4" />}
    {title === "Mobile Money" && < FontAwesomeIcon icon={faPhoneAlt} className="me-4" />}
    {title}
  </NavLink >
}