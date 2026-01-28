import { useQuery } from "@tanstack/react-query";
import Table from "../../layout/Table"
import { user } from "../../data/menu";
import { memo, useRef } from "react";
import Submit from "../../layout/Submit";
import Modal from "../../layout/Modal";
import Notification from "../../layout/Notification";
import { useSelector } from "react-redux";
import CreateUser from "../../components/user/CreateUser";
import { getAllUsers, getUsersAdmin } from "../../utils/http";

const UsersPage = memo(() => {

  const errorNotification = useSelector(state => state.note.error);
  const relaunch = useSelector(state => state.note.relaunch);
  const dataItem = useSelector(state => state.note.dataItem)
  const userItem = JSON.parse(localStorage.getItem("user"))


  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: userItem.role.includes("ROLE_SUPERADMIN") ? getUsersAdmin : getAllUsers,
    enabled: userItem.role.includes("ROLE_SUPERADMIN") || userItem.role.includes("ROLE_ADMIN")
  })

  const users = []
  if (data) {
    let state;
    let connected;
    data.forEach(d => {
      if (d.enabled) {
        state = "Actif"
      } else {
        state = "Inactif"
      }
      if (d.connected) {
        connected = "Connecté"
      } else {
        connected = "Pas connecté"
      }

      users.push({
        id: d.id,
        refUser: d.refUser,
        username: d.username,
        lastName: d.lastName,
        firstName: d.firstName,
        email: d.email,
        phone: d.phone,
        enabled: state,
        connected: connected,
        numberConnexion: d.numberConnexion,
        role: d.role,
        dateCreation: d.dateCreation,
        userCreated: d.userCreated,
        userType: d.userType,
        userRef: d.userRef
      })
    }

    )
  }



  const dialog = useRef()

  function handleModal() {
    dialog.current.open();
  }


  return <>
    <div className="flex justify-center">
      <Submit onClick={handleModal}>Nouveau</Submit>
    </div>
    <Table data={data} headers={user.header} emptyMessage="Aucun utilisateur trouvé." sheet="User" titleRef="Mise à jour informations de l'utilisateur" size="lg:w-4/15 lg:h-9/10" />
    <Modal ref={dialog} size="lg:h-4/8 lg:w-4/15" title={`Créer un ${user.role?.includes("ROLE_ADMIN") ? "utilisateur" : "administrateur"}`}>
      <CreateUser />
    </Modal>
    {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
  </>
})

export default UsersPage;