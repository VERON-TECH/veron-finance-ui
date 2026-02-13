import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllSales } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { sales } from "../../data/dataTable.js";
import CreateSale from "../../components/sale/CreateSale.jsx";




export default function SalePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const cash = useSelector(state => state.cash)


    const { data } = useQuery({
        queryKey: ["sale", { enterprise: user.enterprise, agency: user.agency, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() }],
        queryFn: ({ signal }) => getAllSales({ signal, enterprise: user.enterprise, agency: user.agency, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() }),
        enabled: user.role.includes("ROLE_CAISSIER")
    })


    const dialog = useRef()

    function handleModal() {
        dialog.current.open();
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "sale" }))
    }, [menu, dispatch, cash])

    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_CAISSIER") && user.cashes.length > 0 ? <Submit onClick={handleModal}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={sales.header} emptyMessage="Aucun vente trouvée." globalFilterFields={sales.global} sheet="Vente" titleRef="Mise à jour informations d'une vente" size="lg:h-7/12 lg:w-4/15 xl:h-8/12" />
        <Modal ref={dialog} size="lg:h-11/12 lg:w-15/15 xl:h-11/12" title="Créer une vente">
            <CreateSale />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}