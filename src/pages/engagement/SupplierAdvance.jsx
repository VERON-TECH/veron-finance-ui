import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllInvoices, getAllSupplierAdvances } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { invoices, supplierAdvances } from "../../data/dataTable.js";


export default function SupplierAdvancePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["invoice", { enterprise: user.enterprise, agency: user.agency, invoiceType: "EMISE" }],
        queryFn: ({ signal }) => getAllSupplierAdvances({ signal, enterprise: user.enterprise, agency: user.agency, invoiceType: "EMISE" }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")
    })



    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "engagement" }))
    }, [menu, dispatch])

    return <>
        <Table data={data} headers={supplierAdvances.header} emptyMessage="Aucune avance trouvée." globalFilterFields={supplierAdvances.global} sheet="Avance" titleRef="Visualiser une avance" size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" />

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}