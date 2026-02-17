import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllInvoices, getEnterpriseById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useState } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { invoices } from "../../data/dataTable.js";
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


export default function InvoiceSupplierPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        invoice: [],
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
                const allEngagements = await getAllInvoices({ signal, enterprise: user?.enterprise, agency: user?.agency, invoiceType: "RECUE" })
                let tb = []
                let enterprise = {}
                let agency = {}
                for (let e of allEngagements) {
                    enterprise = await getEnterpriseById({ id: e.enterprise, signal })
                    agency = await getAgencyById({ id: e.agency, signal })
                    e.enterprise = enterprise.slug
                    e.agency = agency.slug
                    tb.push(e)
                }
                setData(prev => {
                    return {
                        ...prev,
                        invoice: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <Table data={data?.invoice} headers={invoices.header} emptyMessage="Aucune facture trouvée." globalFilterFields={invoices.global} sheet="Facture" titleRef="Visualiser les factures" size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}