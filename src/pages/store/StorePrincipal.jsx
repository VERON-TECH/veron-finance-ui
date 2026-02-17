
import { useDispatch, useSelector } from "react-redux";
import { getAllStorePrincipal, getEnterpriseById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { storePrincipals } from "../../data/dataTable.js";
import CreateStorePrincipal from "../../components/storePrincipal/CreateStorePrincipal.jsx";
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";




export default function StorePincipalPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        storePrincipal: [],
        isLoading: false
    })



    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "storePrincipal") {
            dialog.current.open();
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
                const allStorePrincipals = await getAllStorePrincipal({ signal, enterprise: user?.enterprise, agency: user?.agency })
                let tb = []
                let enterprise = {}
                for (let s of allStorePrincipals) {
                    enterprise = await getEnterpriseById({ id: s.enterprise, signal })
                    s.enterprise = enterprise.slug
                    tb.push(s)
                }
                setData(prev => {
                    return {
                        ...prev,
                        storePrincipal: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("storePrincipal")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.storePrincipal} headers={storePrincipals.header} emptyMessage="Aucun magasin principal trouvé." globalFilterFields={storePrincipals.global} sheet="Magasin principal" titleRef="Mise à jour informations d'un magasin principal" size={`${user.role.includes("ROLE_ADMIN") ? "lg:h-5/12 lg:w-6/15 xl:h-5/12" : "lg:h-4/12 lg:w-4/15 xl:h-4/12"}`} />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        <Modal ref={dialog} size="lg:h-4/12 lg:w-4/15" title="Créer un magasin principal">
            <CreateStorePrincipal />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}