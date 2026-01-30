import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllBanks, getAllOperators } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { banks, operators } from "../../data/dataTable.js";
import CreateOperator from "./CreateOperator.jsx";




export default function Operator() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)



    const { data } = useQuery({
        queryKey: ["operators"],
        queryFn: getAllOperators,
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "operator") {
            dialog.current.open();
        }

    }

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("operator")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={operators.header} emptyMessage="Aucune opérateur trouvé." globalFilterFields={operators.global} sheet="Operateur" titleRef="Mise à jour informations d'un opérateur" size="lg:h-3/11 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-3/11 lg:w-4/15" title="Créer un opérateur">
            <CreateOperator />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}