import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllStorePrincipal } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { storePrincipals } from "../../data/dataTable.js";
import CreateStorePrincipal from "../../components/storePrincipal/CreateStorePrincipal.jsx";




export default function StorePincipalPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["storeprincipals", { agency: user.agency }],
        queryFn: ({ signal }) => getAllStorePrincipal({ signal, enterprise: 0, agency: user.agency }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "storePrincipal") {
            dialog.current.open();
        }
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "store" }))
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("storePrincipal")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={storePrincipals.header} emptyMessage="Aucun magasin principal trouvé." globalFilterFields={storePrincipals.global} sheet="Magasin principal" titleRef="Mise à jour informations d'un magasin principal" size="lg:h-5/12 lg:w-4/15 xl:h-5/12" />
        <Modal ref={dialog} size="lg:h-4/12 lg:w-4/15" title="Créer un magasin principal">
            <CreateStorePrincipal />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}