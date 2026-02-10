
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getAllPersonals } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { users } from "../../data/dataTable.js";
import CreateUser from "../../components/user/CreateUser.jsx";
import { useState } from "react"


export default function UserPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState([])

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "personal" }))
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_RESPONSABLE_RH")) {
            let tbEl = {
                tb: [],
                tb1: []
            };
            async function get(signal) {
                const allPersonals = await getAllPersonals({ signal, enterprise: user.enterprise, agency: user.agency })
                allPersonals.forEach(p => {
                    tbEl.tb.push(p.id)
                })

                const users = await getAllUsers({ signal, personals: tbEl.tb, enterprise: user.enterprise, agency: user.agency })
                setData(users)

            }
            get()

        }


    }, [menu, dispatch])





    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "user") {
            dialog.current.open();
        }

    }



    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_RESPONSABLE_RH") ? <Submit onClick={() => handleModal("user")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={users?.header} emptyMessage="Aucun utilisateur trouvé." globalFilterFields={users.global} sheet="Utilisateurs" titleRef="Mise à jour informations d'un utilisateur" size="lg:h-5/10 lg:w-8/16 xl:h-6/10" />

        <Modal ref={dialog} size="lg:h-4/10 lg:w-4/15" title="Créer un utilisateur">
            <CreateUser />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}