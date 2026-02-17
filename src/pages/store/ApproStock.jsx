import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllMvtStocks, getEnterpriseById, getProductById, getStoreById, getStorePrincipalById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { mvtStocks } from "../../data/dataTable.js";
import TransferProductStock from "../../components/stock/TransfetProductStock.jsx";
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";



export default function ApproStockPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        mvtStock: [],
        isLoading: false
    })

    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "stock") {
            dialog.current.open();
        }
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "stock" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")) {
            async function get(signal) {
                const allMvtStocks = await getAllMvtStocks({ signal, enterprise: user.enterprise, agency: user.agency, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() })
                let tb = []
                let enterprise = {}
                let agency = {}
                let storePrincipal = {}
                let store01 = {}
                let store02 = {}
                let product = {}
                for (let m of allMvtStocks) {
                    enterprise = await getEnterpriseById({ id: m.enterprise, signal })
                    agency = await getAgencyById({ id: m.agency, signal })
                    storePrincipal = m.storePrincipal !== 0 ? await getStorePrincipalById({ id: m.storePrincipal, signal }) : 0
                    store01 = m.store01 !== 0 ? await getStoreById({ id: m.store01, signal }) : 0
                    store02 = m.store02 ? await getStoreById({ id: m.store02, signal }) : 0
                    product = await getProductById({ signal, id: m.product })
                    m.enterprise = enterprise.slug
                    m.agency = agency.slug
                    m.storePrincipal = storePrincipal.slug
                    m.store01 = store01.slug
                    m.store02 = store02.slug
                    m.product = product.slug
                    tb.push(m)
                }
                setData(prev => {
                    return {
                        ...prev,
                        mvtStock: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <Submit onClick={() => handleModal("stock")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.mvtStock} headers={mvtStocks.header} emptyMessage="Aucun mouvement trouvé." globalFilterFields={mvtStocks.global} sheet="Mouvement de stock" titleRef="Informations sur un mouvement de stock" size="lg:h-4/12 lg:w-7/15 xl:w-7/15 xl:h-4/12" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        <Modal ref={dialog} size="lg:h-9/12 lg:w-11/15 xl:w-15/15 xl:h-8/12" title="Créer une transfert inter-magasins">
            <TransferProductStock />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}