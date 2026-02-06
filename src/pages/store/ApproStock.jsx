import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllMvtStocks } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { mvtStocks } from "../../data/dataTable.js";
import TransferProductStock from "../../components/stock/TransfetProductStock.jsx";



export default function ApproStockPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["mvtstocks", { enterprise: user.enterprise, agency: user.agency }],
        queryFn: ({ signal }) => getAllMvtStocks({ signal, enterprise: user.enterprise, agency: user.agency, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "stock") {
            dialog.current.open();
        }
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "stock" }))
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <Submit onClick={() => handleModal("stock")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={mvtStocks.header} emptyMessage="Aucun mouvement trouvé." globalFilterFields={mvtStocks.global} sheet="Mouvement de stock" titleRef="Visualiser un mouvement de stock" size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" />
        <Modal ref={dialog} size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" title="Créer une transfert inter-magasins">
            <TransferProductStock />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}