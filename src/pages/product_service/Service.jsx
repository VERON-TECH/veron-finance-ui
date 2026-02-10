import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllServices } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { memo, useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { services } from "../../data/dataTable.js";
import CategoryService from "../../components/service/CategoryService.jsx";
import CreateService from "../../components/service/CreateService.jsx";




export default memo(function ServicePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["services", { enterprise: user?.enterprise, category: 0 }],
        queryFn: ({ signal }) => getAllServices({ signal, enterprise: user?.enterprise, category: 0 }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE_MATIERE") || user.role.includes("ROLE_COMPTABLE")
    })


    const dialog = useRef()
    const dialog1 = useRef()

    function handleModal(identifier) {
        if (identifier === "category") {
            dialog.current.open();
        } else if (identifier === "service") {
            dialog1.current.open();
        }

    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "store" }))
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <Submit onClick={() => handleModal("category")}>Catégories de service</Submit> : undefined}
            {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <Submit onClick={() => handleModal("service")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={services.header} emptyMessage="Aucun service trouvé." globalFilterFields={services.global} sheet="Service" titleRef="Mise à jour informations d'un service" size="lg:h-7/12 lg:w-4/15 xl:h-9/14" />
        <Modal ref={dialog} size="lg:h-6/11 lg:w-12/15 overflow-auto" title="Informations sur les catégories de service">
            <CategoryService />
        </Modal>
        <Modal ref={dialog1} size="lg:h-7/14 lg:w-4/15 xl:h-8/14" title="Créer un service">
            <CreateService />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
})