import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllPrints } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { prints } from "../../data/dataTable.js";
import CreatePrint from "../../components/setting/CreatePrint.jsx";




export default function PrintPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)

    const { data } = useQuery({
        queryKey: ["print", { enterprise: user.enterprise, agency: user.agency }],
        queryFn: ({ signal }) => getAllPrints({ signal, enterprise: user.enterprise, agency: user.agency }),
        enabled: user.role.includes("ROLE_ADMIN")
    })


    const dialog = useRef()

    function handleModal() {
        dialog.current.open();
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "setting" }))
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={handleModal}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={prints.header} emptyMessage="Aucune imprimante trouvée." globalFilterFields={prints.global} sheet="Imprimante" titleRef="Mise à jour informations d'une imprimante" size="lg:h-5/13 lg:w-4/15 xl:h-5/13" />
        <Modal ref={dialog} size="lg:h-5/12 lg:w-4/15 xl:h-5/12" title="Paramétrer une imprimante">
            <CreatePrint />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}