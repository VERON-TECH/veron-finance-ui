import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllStores } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { stores } from "../../data/dataTable.js";
import CreateStore from "../../components/store/CreateStore.jsx";



export default function StorePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["stores", { enterprise: user.enterprise, agency: user.agency }],
        queryFn: ({ signal }) => getAllStores({ signal, enterprise: user.enterprise, agency: user.agency }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "store") {
            dialog.current.open();
        }
    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "store" }))
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <Submit onClick={() => handleModal("store")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={stores.header} emptyMessage="Aucun magasin trouvé." globalFilterFields={stores.global} sheet="Magasin" titleRef="Mise à jour informations d'un magasin" size="lg:h-4/12 lg:w-4/15 xl:h-5/12" />
        <Modal ref={dialog} size="lg:h-4/12 lg:w-4/15 xl:h-5/12" title="Créer un magasin">
            <CreateStore />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}