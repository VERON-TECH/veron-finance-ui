import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllPurchaseOrders } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { purchasOrders } from "../../data/dataTable.js";
import CreatePurchaseOrder from "../../components/purchase/CreatePurchaseOrder.jsx";



export default function PurchaseOrderPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["purchaserorders", { enterprise: user.enterprise, agency: user.agency }],
        queryFn: ({ signal }) => getAllPurchaseOrders({ signal, enterprise: user.enterprise, agency: user.agency }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "store") {
            dialog.current.open();
        }
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "stock" }))
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <Submit onClick={() => handleModal("store")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={purchasOrders.header} emptyMessage="Aucun bon de commande trouvé." globalFilterFields={purchasOrders.global} sheet="Bon de commande" titleRef="Mise à jour informations d'un bon de commande" size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" />
        <Modal ref={dialog} size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" title="Créer une commande">
            <CreatePurchaseOrder />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}