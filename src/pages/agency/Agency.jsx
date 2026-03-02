import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllAgencies, getEnterpriseById } from "../../utils/http";
import { agencies } from "../../data/dataTable.js";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import CreateAgency from "../../components/agency/CreateAgency.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../layout/LogoDark.jsx";




export default function AgencyPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        agency: [],
        isLoading: false
    })


    const dialog = useRef()

    function handleModal() {
        dialog.current.open();
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "administration" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_ADMIN")) {
            async function get(signal) {
                const allAgencies = await getAllAgencies()
                let tb = []
                let enterprise = {}
                for (let a of allAgencies) {
                    enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    a.enterprise = enterprise.slug
                    tb.push(a)
                }
                setData(prev => {
                    return {
                        ...prev,
                        agency: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }

    }, [menu, dispatch])

    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_ADMIN") && <Submit onClick={handleModal}>Nouveau</Submit>}
        </div>
        <Table data={data?.agency} headers={agencies.header} emptyMessage="Aucune agence trouvée." globalFilterFields={agencies.global} sheet="Agences" titleRef="Mise à jour informations de l'agence" size="lg:h-7/11 lg:w-5/15" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        <Modal ref={dialog} size="lg:h-6/10 lg:w-5/15" title="Créer une agence">
            <CreateAgency />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}