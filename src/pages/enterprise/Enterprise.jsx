import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllEnterprises } from "../../utils/http";
import { enterprises } from "../../data/dataTable.js";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import CreateEnterprise from "../../components/enterprise/CreateEnterprise.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function EnterprisePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)



    const { data, isLoading } = useQuery({
        queryKey: ["enterprise"],
        queryFn: getAllEnterprises,
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
        <Table data={data} headers={enterprises.header} emptyMessage="Aucune entreprise trouvée." globalFilterFields={enterprises.global} sheet="Entreprises" titleRef="Mise à jour informations de l'entreprise" size="lg:h-6/9 lg:w-8/15" />
        {isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        <Modal ref={dialog} size="lg:h-6/9 lg:w-8/15" title="Créer une entreprise">
            <CreateEnterprise />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}