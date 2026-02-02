import { useQuery } from "@tanstack/react-query";
import { getAllCashesSafeAuthorization } from "../../utils/http";
import { useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { agencies, cashes } from "../../data/dataTable.js";
import AuhtorizeAgency from "../global/AuthorizeAgency.jsx";
import { useDispatch, useSelector } from "react-redux";
import { authorizeActions } from "../../store/authorizeSlice.js";


export default function AuthorizationSafeCash() {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = useSelector(state => state.modal.value)
    const dispatch = useDispatch()

    const { data } = useQuery({
        queryKey: ["cashesSafe", { id }],
        queryFn: ({ signal }) => getAllCashesSafeAuthorization({ signal, id }),
        enabled: user.role.includes("ROLE_ADMIN") && id != "" || user.role.includes("ROLE_COMPTABLE") && id != ""
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "authorization") {
            dispatch(authorizeActions.changeAuthorize("safe"))
            dialog.current.open();
        }

    }

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={() => handleModal("authorization")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={cashes.header} emptyMessage="Aucune caisse autorisée trouvée." globalFilterFields={cashes.global} sheet="Caisses autorisées" titleRef="Supprimer l'autorisation" size="lg:h-2/12 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-4/11 lg:w-4/15" title="Autoriser une caisse">
            <AuhtorizeAgency />
        </Modal>

    </>
}