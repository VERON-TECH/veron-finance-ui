import { faFolderOpen, faSpinner, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Modal from "../../layout/Modal";
import Table from "../../layout/Table";
import { productStocks } from "../../data/dataTable";
import { getAgencyById, getAllStocksByStore, getEnterpriseById, getLotById, getProductById, getStoreById, getStorePrincipalById } from "../../utils/http";

export default function CardStore({ storePrincipal, name, id }) {
    const [data, setData] = useState({
        isLoading: false,
        stock: []
    })
    const dialog = useRef()

    async function handleClick() {
        const controller = new AbortController()
        const signal = controller.signal
        const allStock = await getAllStocksByStore(id)
        setData(prev => {
            return {
                ...prev,
                isLoading: true,
            }
        })
        let stock = []
        for (let s of allStock) {
            const enterprise = await getEnterpriseById({ id: s.enterprise, signal })
            const agency = await getAgencyById({ id: s.agency, signal })
            const storePrincipal = await getStorePrincipalById({ id: s.storePrincipal, signal })
            const store = await getStoreById({ id: s.store, signal })
            const product = await getProductById({ signal, id: s.product })
            const lot = await getLotById({ signal, id: s.lot })
            s.enterprise = enterprise.slug
            s.agency = agency.slug
            s.storePrincipal = storePrincipal.slug
            s.store = store.slug
            s.product = product.slug
            s.lot = lot.slug
            stock.push(s)
        }
        setData(prev => {
            return {
                ...prev,
                isLoading: false,
                stock
            }
        })
        dialog.current.open()
    }
    return <>
        <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col gap-4 w-1/5 border rounded-xl shadow-2xl shadow-sky-950 bg-sky-950 text-sky-50 p-2">
            <header className="text-center bg-sky-50 text-sky-950 rounded-xl p-1 font-medium shadow-xs shadow-sky-50">{`${storePrincipal !== "" ? storePrincipal : storePrincipal == undefined ? "Non rattaché" : "Non rattaché"}`}</header>
            <main className="text-center font-medium"><FontAwesomeIcon icon={faStore} className="me-2" />{name}</main>
            <div className="flex justify-center gap-2">
                <button className="font-medium flex gap-4 bg-sky-50 text-sky-950 cursor-pointer py-1 px-5 rounded" onClick={handleClick}>
                    <FontAwesomeIcon icon={faFolderOpen} className="shadow-md shadow-sky-950 rounded" />
                    Ouvrir
                </button>
                {data.isLoading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
            </div>

        </motion.div>
        <Modal ref={dialog} size="h-1/1 w-1/1" title={`Stock magasin ${name}`}>
            <Table data={data?.stock} headers={productStocks.header} emptyMessage="Aucun stock trouvé." globalFilterFields={productStocks.global} sheet="Stock" titleRef="Informations sur le stock" size="lg:h-5/12 lg:w-8/15 xl:w-8/15 xl:h-5/12" />
        </Modal>
    </>
}