import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers, getEnterpriseById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { customers } from "../../data/dataTable.js";
import Logo from "../../layout/LogoDark.jsx";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateCustomer from "../../components/customer/CreateCustomer.jsx";




export default function CustomerPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        customer: [],
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
                let tb = []
                const customers = await getAllCustomers({ signal, enterprise: user.enterprise })
                let enterprise = {}
                for (let c of customers) {
                    enterprise = await getEnterpriseById({ id: c.enterprise, signal })
                    c.enterprise = enterprise.slug
                    tb.push(c)
                }
                setData(prev => {
                    return {
                        ...prev,
                        customer: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        {user.cashes.length > 0 ? <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_CAISSIER") && user.cashes.length > 0 ? <Submit onClick={handleModal}>Nouveau</Submit> : undefined}
        </div> : <p className="text-red-500 text-center">Aucune caisse rattachée</p>}
        <Table data={data?.customer} headers={customers.header} emptyMessage="Aucun client trouvé." globalFilterFields={customers.global} sheet="Client" titleRef="Informations sur un client" size="lg:h-7/12 lg:w-8/15 xl:h-7/12" />
        <Modal ref={dialog} size="lg:h-7/12 lg:w-8/15 xl:h-7/12" title="Créer une vente">
            <CreateCustomer />
        </Modal>
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}