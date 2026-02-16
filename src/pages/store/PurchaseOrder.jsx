import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllPurchaseOrders, getEnterpriseById, getSupplierById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
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
    const [data, setData] = useState({
        purchase: []
    })

    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "store") {
            dialog.current.open();
        }
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "stock" }))
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")) {
            async function get(signal) {
                const allPurchaseOrders = await getAllPurchaseOrders({ signal, enterprise: user.enterprise, agency: user.agency })
                let tb = []
                let enterprise = {}
                let agency = {}
                let supplier = {}
                for (let p of allPurchaseOrders) {
                    enterprise = await getEnterpriseById({ id: p.enterprise, signal })
                    agency = await getAgencyById({ id: p.agency, signal })
                    supplier = await getSupplierById({ id: p.supplier, signal })
                    p.enterprise = enterprise.slug
                    p.agency = agency.slug
                    p.supplier = supplier.slug
                    tb.push(p)
                }
                setData(prev => {
                    return {
                        ...prev,
                        purchase: tb
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <Submit onClick={() => handleModal("store")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.purchase} headers={purchasOrders.header} emptyMessage="Aucun bon de commande trouvé." globalFilterFields={purchasOrders.global} sheet="Bon de commande" titleRef="Mise à jour informations d'un bon de commande" size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" />
        <Modal ref={dialog} size="lg:h-10/12 lg:w-15/15 xl:w-15/15 xl:h-10/12" title="Créer une commande">
            <CreatePurchaseOrder />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}