import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllInvoices, getCustomerById, getEnterpriseById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useState } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { invoices } from "../../data/dataTable.js";
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


export default function InvoiceSalePage() {
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
        dispatch(identifierMenuActions.updateMenu({ menu: "sale" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        async function get(signal) {
            const allInvoices = await getAllInvoices({ signal, enterprise: user.enterprise, agency: user.agency, invoiceType: "EMISE" })
            let tb = []
            let enterprise = {}
            let agency = {}
            let customer = {}
            for (let i of allInvoices) {
                enterprise = await getEnterpriseById({ id: i.enterprise, signal })
                agency = await getAgencyById({ id: i.agency, signal })
                customer = await getCustomerById({ signal, id: i.tiers })
                i.enterprise = enterprise.slug
                i.agency = agency.slug
                i.tiers = customer.lastName + " " + customer.firstName
                tb.push(i)
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


    }, [menu, dispatch])

    return <>
        <Table data={data?.invoice} headers={invoices.header} emptyMessage="Aucune facture trouvée." globalFilterFields={invoices.global} sheet="Facture" titleRef="Informations sur une facture" size="lg:h-9/12 lg:w-8/15 xl:w-9/15 xl:h-8/12" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}