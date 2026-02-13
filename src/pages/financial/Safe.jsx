import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllSafes } from "../../utils/http";
import { safes } from "../../data/dataTable.js";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import CreateSafe from "../../components/safe/CreateSafe.jsx";




export default function SafePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)




    const dialog = useRef()

    function handleModal() {
        dialog.current.open();
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "financial" }))
    }, [menu, dispatch])



    const { data } = useQuery({
        queryKey: ["safes", { enterprise: user.enterprise, agency: user.agency }],
        queryFn: ({ signal }) => getAllSafes({ signal, enterprise: user.enterprise, agency: user.agency }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")
    })

    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={handleModal}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={safes.header} emptyMessage="Aucun coffre-fort trouvé." globalFilterFields={safes.global} sheet="Coffre_fort" titleRef="Mise à jour informations du coffre-fort" size="lg:h-5/11 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-3/11 lg:w-4/15" title="Créer un coffre-fort">
            <CreateSafe />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}