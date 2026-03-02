import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllSales, getCashById, getCustomerById, getEnterpriseById, getInvoiceById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { sales } from "../../data/dataTable.js";
import CreateSale from "../../components/sale/CreateSale.jsx";
import Logo from "../../layout/LogoDark.jsx";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




export default function SalePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const cash = useSelector(state => state.cash)
    const [data, setData] = useState({
        sale: [],
        isLoading: false
    })


    const dialog = useRef()

    function handleModal() {
        dialog.current.open();
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "sale" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_CAISSIER")) {
            async function get(signal) {
                let cashes = []
                for (let c of user.cashes) {
                    cashes.push(c.value)
                }
                const allSales = await getAllSales({ signal, enterprise: user.enterprise, agency: user.agency, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString(), cashes, customer: 0 })
                let tb = []
                let enterprise = {}
                let agency = {}
                let cash = {}
                let customer = {}
                let invoice = {}
                for (let s of allSales) {
                    enterprise = await getEnterpriseById({ id: s.enterprise, signal })
                    agency = await getAgencyById({ id: s.agency, signal })
                    cash = await getCashById({ id: s.cash, signal })
                    customer = await getCustomerById({ signal, id: s.customer })
                    invoice = s.invoice !== 0 ? await getInvoiceById({ signal, id: s.invoice }) : 0
                    s.enterprise = enterprise.slug
                    s.agency = agency.slug
                    s.cash = cash.slug
                    s.customer = customer.lastName + " " + customer.firstName
                    s.invoice = invoice.slug
                    tb.push(s)
                }
                setData(prev => {
                    return {
                        ...prev,
                        sale: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch, cash])

    return <>
        {user.cashes.length > 0 ? <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_CAISSIER") && user.cashes.length > 0 ? <Submit onClick={handleModal}>Nouveau</Submit> : undefined}
        </div> : <p className="text-red-500 text-center">Aucune caisse rattachée</p>}
        <Table data={data?.sale} headers={sales.header} emptyMessage="Aucun vente trouvée." globalFilterFields={sales.global} sheet="Vente" titleRef="Informations sur une vente" size="lg:h-7/12 lg:w-8/15 xl:h-7/12" />
        <Modal ref={dialog} size="lg:h-11/12 lg:w-15/15 xl:h-11/12" title="Créer une vente">
            <CreateSale />
        </Modal>
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}