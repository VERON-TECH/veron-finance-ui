import { useQuery } from "@tanstack/react-query";
import { getAllBanks } from "../../utils/http";
import { useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import CreateBank from "../../components/bankAccount/CreateBank.jsx";
import { banks } from "../../data/dataTable.js";




export default function Bank() {
    const user = JSON.parse(localStorage.getItem("user"));


    const { data } = useQuery({
        queryKey: ["banks"],
        queryFn: getAllBanks,
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "bank") {
            dialog.current.open();
        }

    }

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("bank")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={banks.header} emptyMessage="Aucune banque trouvée." globalFilterFields={banks.global} sheet="Banque" titleRef="Mise à jour informations d'une banque" size="lg:h-3/11 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-3/11 lg:w-4/15" title="Créer une banque">
            <CreateBank />
        </Modal>

    </>
}