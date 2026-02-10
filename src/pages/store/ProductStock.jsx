import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllStocks } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { productStocks, purchasOrders } from "../../data/dataTable.js";
import Submit from "../../layout/Submit.jsx";
import Modal from "../../layout/Modal.jsx";
import CreateSupplies from "../../components/stock/CreateSupplies.jsx";
import CreateRebuts from "../../components/stock/CreateRebuts.jsx";
import CreatePackage from "../../components/stock/CreatePackage.jsx";



export default function ProductStockPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["productstocks", { enterprise: user.enterprise, agency: user.agency, storePrincipal: 0, store: 0, product: 0, lot: 0 }],
        queryFn: ({ signal }) => getAllStocks({ signal, enterprise: user.enterprise, agency: user.agency, storePrincipal: 0, store: 0, product: 0, lot: 0 }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")
    })


    const dialog = useRef()
    const dialog1 = useRef()
    const dialog2 = useRef()


    function handleClick(identifier) {
        if (identifier === "supplies") {
            dialog.current.open()
        }
        if (identifier === "rebuts") {
            dialog1.current.open()
        }
        if (identifier === "packages") {
            dialog2.current.open()
        }
    }


    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "store" }))
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-4">
            <Submit onClick={() => handleClick("supplies")}>
                Fournitures
            </Submit>
            <Submit onClick={() => handleClick("rebuts")}>
                Rébuts
            </Submit>
            <Submit onClick={() => handleClick("packages")}>
                Paquets
            </Submit>
        </div>
        <Table data={data} headers={productStocks.header} emptyMessage="Aucun stock trouvé." globalFilterFields={purchasOrders.global} sheet="Stock" titleRef="Visulaiser le stock" size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" />

        <Modal ref={dialog} size="lg:h-9/12 lg:w-11/15 xl:w-9/15 xl:h-10/12" title="Créer un sortie de founiture">
            <CreateSupplies />
        </Modal>
        <Modal ref={dialog1} size="lg:h-6/12 lg:w-7/14 xl:w-8/15 xl:h-8/14" title="Créer un rébut">
            <CreateRebuts />
        </Modal>

        <Modal ref={dialog2} size="lg:h-9/12 lg:w-11/15 xl:w-15/15 xl:h-8/12" title="Créer un pacquet">
            <CreatePackage />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}