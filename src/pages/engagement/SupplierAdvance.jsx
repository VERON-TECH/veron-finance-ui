import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllInvoices, getAllSupplierAdvances, getEnterpriseById, getSupplierById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useState } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { invoices, supplierAdvances } from "../../data/dataTable.js";
import Logo from "../../layout/LogoDark.jsx";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function SupplierAdvancePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        advance: [],
        isLoading: false
    })
    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "engagement" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")) {
            async function get(signal) {
                const allEngagements = await getAllSupplierAdvances({ signal, enterprise: user?.enterprise, agency: user?.agency })
                let tb = []
                let enterprise = {}
                let agency = {}
                let supplier = {}
                for (let e of allEngagements) {
                    enterprise = await getEnterpriseById({ id: e.enterprise, signal })
                    agency = await getAgencyById({ id: e.agency, signal })
                    supplier = await getSupplierById({ id: e.supplier, signal })
                    e.enterprise = enterprise.slug
                    e.agency = agency.slug
                    e.supplier = supplier.slug
                    tb.push(e)
                }
                setData(prev => {
                    return {
                        ...prev,
                        advance: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <Table data={data?.advance} headers={supplierAdvances.header} emptyMessage="Aucune avance trouvée." globalFilterFields={supplierAdvances.global} sheet="Avance" titleRef="Visualiser une avance" size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}