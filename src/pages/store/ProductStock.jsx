
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllStocks, getEnterpriseById, getLotById, getProductById, getStoreById, getStorePrincipalById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { productStocks, purchasOrders } from "../../data/dataTable.js";
import Submit from "../../layout/Submit.jsx";
import Modal from "../../layout/Modal.jsx";
import CreateSupplies from "../../components/stock/CreateSupplies.jsx";
import CreateRebuts from "../../components/stock/CreateRebuts.jsx";
import CreatePackage from "../../components/stock/CreatePackage.jsx";
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";



export default function ProductStockPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        stock: [],
        isLoading: false
    })

    const dialog = useRef()
    const dialog1 = useRef()
    const dialog2 = useRef()


    function handleClick(identifier) {
        if (identifier === "supplies") {
            dialog.current.open()
        }
        if (identifier === "rebuts") {
            dialog1.current.open()
        }
        if (identifier === "packages") {
            dialog2.current.open()
        }
    }


    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "store" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")) {
            async function get(signal) {
                const allStocks = await getAllStocks({ signal, enterprise: user.enterprise, agency: user.agency, storePrincipal: 0, store: 0, product: 0, lot: 0 })
                let tb = []
                let enterprise = {}
                let agency = {}
                let storePrincipal = {}
                let store = {}
                let product = {}
                let lot = {}
                for (let s of allStocks) {
                    enterprise = await getEnterpriseById({ id: s.enterprise, signal })
                    agency = await getAgencyById({ id: s.agency, signal })
                    storePrincipal = s.storePrincipal !== 0 ? await getStorePrincipalById({ id: s.storePrincipal, signal }) : 0
                    store = s.store !== 0 ? await getStoreById({ id: s.store, signal }) : 0
                    product = await getProductById({ signal, id: s.product })
                    lot = await getLotById({ signal, id: s.lot })
                    s.enterprise = enterprise.slug
                    s.agency = agency.slug
                    s.storePrincipal = storePrincipal !== 0 ? storePrincipal.slug : 0
                    s.store = store !== 0 ? store.slug : 0
                    s.product = product.slug
                    s.lot = lot.slug
                    tb.push(s)
                }
                setData(prev => {
                    return {
                        ...prev,
                        stock: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <div className="flex justify-center gap-4">
            <Submit onClick={() => handleClick("supplies")}>
                Fournitures
            </Submit>
            <Submit onClick={() => handleClick("rebuts")}>
                Rébuts
            </Submit>
            <Submit onClick={() => handleClick("packages")}>
                Paquets
            </Submit>
        </div> : undefined}

        <Table data={data?.stock} headers={productStocks.header} emptyMessage="Aucun stock trouvé." globalFilterFields={purchasOrders.global} sheet="Stock" titleRef="Informations sur le stock" size="lg:h-5/12 lg:w-8/15 xl:w-8/15 xl:h-5/12" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        <Modal ref={dialog} size="lg:h-9/12 lg:w-11/15 xl:w-9/15 xl:h-10/12" title="Créer un sortie de founiture">
            <CreateSupplies />
        </Modal>
        <Modal ref={dialog1} size="lg:h-6/12 lg:w-7/14 xl:w-8/15 xl:h-8/14" title="Créer un rébut">
            <CreateRebuts />
        </Modal>

        <Modal ref={dialog2} size="lg:h-9/12 lg:w-11/15 xl:w-15/15 xl:h-8/12" title="Créer un pacquet">
            <CreatePackage />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}