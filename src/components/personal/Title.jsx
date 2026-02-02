import { useQuery } from "@tanstack/react-query";
import { getAllTitles } from "../../utils/http";
import { useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { titles } from "../../data/dataTable.js";
import CreateTitle from "./CreateTitle.jsx";

export default function Title() {
    const user = JSON.parse(localStorage.getItem("user"));


    const { data } = useQuery({
        queryKey: ["titles"],
        queryFn: getAllTitles,
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_RESPONSABLE_RH")
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "title") {
            dialog.current.open();
        }

    }

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_RESPONSABLE_RH") ? <Submit onClick={() => handleModal("title")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={titles.header} emptyMessage="Aucune fonction trouvée." globalFilterFields={titles.global} sheet="Fonction" titleRef="Mise à jour informations d'une fonction" size="lg:h-3/11 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-3/11 lg:w-4/15" title="Créer une fonction">
            <CreateTitle />
        </Modal>
    </>
}