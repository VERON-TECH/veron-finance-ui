import { useQuery } from "@tanstack/react-query";
import { getCategoryService } from "../../utils/http";
import { useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { categoryServices } from "../../data/dataTable.js";
import CreateCategory from "./CreateCategory.jsx";




export default function CategoryService() {
    const user = JSON.parse(localStorage.getItem("user"));


    const { data } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategoryService,
        enabled: user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE")
    })


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "category") {
            dialog.current.open();
        }

    }

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <Submit onClick={() => handleModal("category")}>Nouveau</Submit> : undefined}
        </div>

        <Table data={data} headers={categoryServices.header} emptyMessage="Aucune catégorie trouvée." globalFilterFields={categoryServices.global} sheet="Banque" titleRef="Mise à jour informations d'une catégorie de service" size="lg:h-3/11 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-3/11 lg:w-4/15" title="Créer une catégorie">
            <CreateCategory />
        </Modal>

    </>
}