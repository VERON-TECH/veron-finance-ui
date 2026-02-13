import { useQuery } from "@tanstack/react-query";
import { getAllBanks, getAllFamily } from "../../utils/http";
import { useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import CreateBank from "../../components/bankAccount/CreateBank.jsx";
import { banks, families } from "../../data/dataTable.js";
import CreateFamilySpent from "./CreateFamilySpent.jsx";




export default function FamilySpent() {
    const user = JSON.parse(localStorage.getItem("user"));


    const { data } = useQuery({
        queryKey: ["families"],
        queryFn: getAllFamily,
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "family") {
            dialog.current.open();
        }

    }

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={() => handleModal("family")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={families.header} emptyMessage="Aucune famille trouvée." globalFilterFields={banks.global} sheet="Famille" titleRef="Mise à jour informations d'une famille" size="lg:h-3/11 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-3/11 lg:w-4/15" title="Créer une famille de dépense">
            <CreateFamilySpent />
        </Modal>

    </>
}