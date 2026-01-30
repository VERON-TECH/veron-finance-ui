import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllAgencies } from "../../utils/http";
import { agencies } from "../../data/dataTable.js";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import CreateAgency from "../../components/agency/CreateAgency.jsx";




export default function AgencyPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["agencies"],
        queryFn: getAllAgencies,
        enabled: user.role.includes("ROLE_ADMIN")
    })


    const dialog = useRef()

    function handleModal() {
        dialog.current.open();
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "administration" }))
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_ADMIN") && <Submit onClick={handleModal}>Nouveau</Submit>}
        </div>
        <Table data={data} headers={agencies.header} emptyMessage="Aucune agence trouvée." globalFilterFields={agencies.global} sheet="Agences" titleRef="Mise à jour informations de l'agence" size="lg:h-7/11 lg:w-5/15" />
        <Modal ref={dialog} size="lg:h-6/10 lg:w-5/15" title="Créer une agence">
            <CreateAgency />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}