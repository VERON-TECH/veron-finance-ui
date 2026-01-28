import { useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { modalActions } from "../store/modalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faDatabase, faDiagramProject, faFileImport, faUnlockKeyhole, faUserGroup, faUserLarge } from "@fortawesome/free-solid-svg-icons";


export default function MenuBarItem({ url, title, size = "w-3/25" }) {
  const dispatch = useDispatch();
  function handleClick() {
    dispatch(modalActions.update(title));
  }
  const className = `cursor-pointer flex justify-center items-center font-medium ${size} hover:border-b-4 focus:border-b-4 active:border-b-4`
  return <NavLink to={url} className={`({isActive})=>isActive ? ${className} : undefined`} onClick={handleClick}>
    {title === "Utilisateurs" && < FontAwesomeIcon icon={faUserGroup} className="me-4" />}
    {title === "Données" && < FontAwesomeIcon icon={faDatabase} className="me-4" />}
    {title === "Bénéficiaire" && < FontAwesomeIcon icon={faUserLarge} className="me-4" />}
    {title === "Segments" && < FontAwesomeIcon icon={faDiagramProject} className="me-4" />}
    {title === "Financements" && < FontAwesomeIcon icon={faCoins} className="me-4" />}
    {title === "Importations" && < FontAwesomeIcon icon={faFileImport} className="me-4" />}
    {title === "Mot de passe" && < FontAwesomeIcon icon={faUnlockKeyhole} className="me-4" />}
    {title}
  </NavLink >
}