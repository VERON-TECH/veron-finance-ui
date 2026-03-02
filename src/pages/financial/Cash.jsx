import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllCashes, getEnterpriseById, getPersonalById, getSafeById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import CreateCash from "../../components/cash/CreateCash.jsx";
import { cashes } from "../../data/dataTable.js";
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";




export default function CashPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        cash: [],
        isLoading: false
    })

    const dialog = useRef()

    function handleModal() {
        dialog.current.open();
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "financial" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")) {
            async function get(signal) {
                const allCashes = await getAllCashes({ signal, enterprise: user.enterprise, agency: user.agency })
                let tb = []
                let enterprise = {}
                let agency = {}
                let safe = {}
                let personal = {}
                for (let c of allCashes) {
                    enterprise = await getEnterpriseById({ id: c.enterprise, signal })
                    agency = await getAgencyById({ id: c.agency, signal })
                    safe = await getSafeById({ id: c.safe, signal })
                    personal = c.personal != 0 && await getPersonalById({ id: c.personal, signal })
                    c.enterprise = enterprise.slug
                    c.agency = agency.slug
                    c.safe = safe.slug
                    c.personal = c.personal != 0 ? personal.lastName + " " + personal.firstName : ""
                    tb.push(c)
                }
                setData(prev => {
                    return {
                        ...prev,
                        cash: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={handleModal}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.cash} headers={cashes.header} emptyMessage="Aucune caisse trouvée." globalFilterFields={cashes.global} sheet="Caisse" titleRef="Mise à jour informations de la caisse" size="lg:h-5/11 lg:w-4/15" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        <Modal ref={dialog} size="lg:h-3/11 lg:w-4/15" title="Créer une caisse">
            <CreateCash />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}