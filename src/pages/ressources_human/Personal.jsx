import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllPersonals } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { personals } from "../../data/dataTable.js";
import Title from "../../components/personal/Title.jsx";
import CreatePersonal from "../../components/personal/CreatePersonal.jsx";

export default function PersonalPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)



    const dialog = useRef()
    const dialog1 = useRef()

    function handleModal(identifier) {
        if (identifier === "title") {
            dialog.current.open();
        } else if (identifier === "personal") {
            dialog1.current.open();
        }

    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "personal" }))

    }, [menu, dispatch, user])


    const { data } = useQuery({
        queryKey: ["personals", { enterprise: user.enterprise, agency: user.agency }],
        queryFn: ({ signal }) => getAllPersonals({ signal, enterprise: user.enterprise, agency: user.agency }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_RESPONSABLE_RH")
    })


    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("title")}>Fonctions</Submit> : undefined}
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("personal")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={personals.header} emptyMessage="Aucun personnel trouvé." globalFilterFields={personals.global} sheet="Personnel" titleRef="Mise à jour informations d'un employé" size="lg:h-6/9 lg:w-8/15" />
        <Modal ref={dialog} size="lg:h-6/11 lg:w-12/15 overflow-auto" title="Informations sur les fonctions">
            <Title />
        </Modal>
        <Modal ref={dialog1} size="lg:h-6/9 lg:w-8/15" title="Créer un employé">
            <CreatePersonal />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}