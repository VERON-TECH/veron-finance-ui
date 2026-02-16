import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getEnterpriseById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { products } from "../../data/dataTable.js";
import CreateProduct from "../../components/product/CreateProduct.jsx";




export default function ProductPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState(
        {
            product: []
        }
    )


    const dialog = useRef()

    function handleModal() {
        dialog.current.open();
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "store" }))
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")) {
            async function get(signal) {
                const allProducts = await getAllProducts({ signal, enterprise: user?.enterprise })
                let tb = []
                let enterprise = {}
                for (let p of allProducts) {
                    enterprise = p.enterprise != 0 && await getEnterpriseById({ id: p.enterprise, signal })
                    p.enterprise = p.enterprise != 0 ? enterprise.slug : ""
                    tb.push(p)
                }
                setData(prev => {
                    return {
                        ...prev,
                        product: tb
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_COMPTABL_MATIERE") || user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={handleModal}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.product} headers={products.header} emptyMessage="Aucun produit trouvé." globalFilterFields={products.global} sheet="Produit" titleRef="Mise à jour informations d'un produit" size="lg:h-7/12 lg:w-4/15 xl:h-8/12" />
        <Modal ref={dialog} size="lg:h-7/12 lg:w-4/15 xl:h-7/12" title="Créer un produit">
            <CreateProduct />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}