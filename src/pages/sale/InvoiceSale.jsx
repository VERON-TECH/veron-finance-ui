import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllInvoices } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { invoices } from "../../data/dataTable.js";


export default function InvoiceSalePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["invoice", { enterprise: user.enterprise, agency: user.agency, invoiceType: "EMISE" }],
        queryFn: ({ signal }) => getAllInvoices({ signal, enterprise: user.enterprise, agency: user.agency, invoiceType: "EMISE" }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_CAISSIER")
    })



    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "sale" }))
    }, [menu, dispatch])

    return <>
        <Table data={data} headers={invoices.header} emptyMessage="Aucune facture trouvée." globalFilterFields={invoices.global} sheet="Facture" titleRef="Visualiser les factures" size="lg:h-9/12 lg:w-8/15 xl:w-9/15 xl:h-8/12" />

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}