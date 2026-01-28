import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSubmit } from "react-router"
import Submit from "../../layout/Submit"
import { useEffect, useRef, useState } from "react"
import Modal from "../../layout/Modal"
import { AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { authActions } from "../../store/authSlice"
import { logout } from "../../utils/http"


export default function Header() {
  const [user, setUser] = useState({ username: "", role: [] })
  const dialog = useRef();
  const submit = useSubmit();
  const dispatch = useDispatch();

  function handleShowModal() {
    dialog.current.open();
  }

  async function handleLogout() {
    const user = JSON.parse(localStorage.getItem("user"))
    await logout(user?.refUsers);
    submit(null, { method: "post" }, { action: "/" })
    dispatch(authActions.logout())
  }

  function handleExit() {
    dialog.current.close();
  }

  useEffect(() => {
    const userItem = JSON.parse(localStorage.getItem("user"))
    setUser(prev => {
      return {
        ...prev,
        username: userItem?.username,
        role: userItem?.role,
        fullName: userItem?.fullName
      }
    })
  }, [])



  return <>

    <header className="flex gap-10 absolute right-0 top-0 h-2/25 p-4">
      <span className="font-bold italic"> <span className="font-bold italic"><FontAwesomeIcon icon={faUser} className="me-2" /></span>{user.username}</span>
      {user?.role?.map(r => (
        <span className="font-bold italic" key={r}>{r.replace("ROLE_", "")}</span>
      ))}
      <span className="font-bold italic">{user?.fullName}</span>
      <button className="cursor-pointer" onClick={handleShowModal}><FontAwesomeIcon icon={faSignOut} /></button>
    </header>

    <AnimatePresence>
      <Modal ref={dialog} title="Déconnexion" size="lg:w-1/5 lg:h-2/9">
        <p className="p-2 text-center font-bold mb-2">Souhaitez-vous vous déconnecter?</p>
        <form className="flex justify-center">
          <div className="flex gap-4">
            <Submit formAction={handleLogout}>Oui</Submit>
            <Submit formAction={handleExit}>Non</Submit>
          </div>
        </form>
      </Modal>
    </AnimatePresence>

  </>
}