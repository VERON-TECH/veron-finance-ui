import { useQuery } from "@tanstack/react-query";
import { getAllStoreByStorePrincipal } from "../../utils/http";
import { useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { agencies, stores } from "../../data/dataTable.js";
import AuhtorizeAgency from "../global/AuthorizeAgency.jsx";
import { useDispatch, useSelector } from "react-redux";


export default function AuthorizationStorePrincipalStore() {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = useSelector(state => state.modal.value)
    const dispatch = useDispatch()

    const { data } = useQuery({
        queryKey: ["storesstoreprincipal", { id }],
        queryFn: ({ signal }) => getAllStoreByStorePrincipal({ signal, storePrincipal: id }),
        enabled: user.role.includes("ROLE_ADMIN") && id != ""
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "authorization") {
            dialog.current.open();
        }

    }

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("authorization")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={stores.header} emptyMessage="Aucune magasin autorisé trouvée." globalFilterFields={stores.global} sheet="Magasins autorisés" titleRef="Supprimer l'autorisation dans un magasin principal" size="lg:h-2/12 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-3/11 lg:w-4/15" title="Autoriser un magasin">
            <AuhtorizeAgency type="store" id={id} />
        </Modal>

    </>
}