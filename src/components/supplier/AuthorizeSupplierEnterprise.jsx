import { useQuery } from "@tanstack/react-query";
import { getAllAgenciesBankAuthorization, getAllEnterpriseSupplierAuthorization } from "../../utils/http";
import { useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { agencies, enterprises } from "../../data/dataTable.js";
import AuhtorizeAgency from "../global/AuthorizeAgency.jsx";
import { useDispatch, useSelector } from "react-redux";





export default function AuthorizationSupplierEnterprise() {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = useSelector(state => state.modal.value)

    const { data } = useQuery({
        queryKey: ["enterprisesupllier", { id }],
        queryFn: ({ signal }) => getAllEnterpriseSupplierAuthorization({ signal, id }),
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
        <Table data={data} headers={enterprises.header} emptyMessage="Aucune entreprise autorisée trouvée." globalFilterFields={enterprises.global} sheet="Entreprises autorisées" titleRef="Supprimer l'autorisation dans une entreprise" size="lg:h-2/12 lg:w-4/15 xl:h-3/13" />
        <Modal ref={dialog} size="lg:h-4/11 lg:w-4/15 xl:h-4/11" title="Autoriser une fournisseur">
            <AuhtorizeAgency type={"supplier"} id={id} />
        </Modal>

    </>
}