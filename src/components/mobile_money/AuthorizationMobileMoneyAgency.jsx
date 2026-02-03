import { useQuery } from "@tanstack/react-query";
import { getAllAgenciesMobileAuthorization } from "../../utils/http";
import { useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { agencies } from "../../data/dataTable.js";
import AuhtorizeAgency from "../global/AuthorizeAgency.jsx";
import { useDispatch, useSelector } from "react-redux";





export default function AuthorizationMobileMoneyAgency() {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = useSelector(state => state.modal.value)


    const { data } = useQuery({
        queryKey: ["agenciesmobilemoney", { id }],
        queryFn: ({ signal }) => getAllAgenciesMobileAuthorization({ signal, id }),
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
        <Table data={data} headers={agencies.header} emptyMessage="Aucune agence autorisée trouvée." globalFilterFields={agencies.global} sheet="Agences autorisées" titleRef="Supprimer l'autorisation dans un compte mobile money" size="lg:h-2/12 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-4/11 lg:w-4/15" title="Autoriser une agence">
            <AuhtorizeAgency type="mobile" id={id} />
        </Modal>

    </>
}