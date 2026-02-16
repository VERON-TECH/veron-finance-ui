import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllPersonals, getEnterpriseById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { memo, useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { personals } from "../../data/dataTable.js";
import Title from "../../components/personal/Title.jsx";
import CreatePersonal from "../../components/personal/CreatePersonal.jsx";

export default memo(function PersonalPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        personal: []
    })



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
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_RESPONSABLE_RH")) {
            async function get(signal) {
                const allPersonals = await getAllPersonals({ signal, enterprise: user?.enterprise, agency: user?.agency })
                let tb = []
                let enterprise = {}
                let agency = {}
                for (let p of allPersonals) {
                    enterprise = await getEnterpriseById({ id: p.enterprise, signal })
                    agency = await getAgencyById({ id: p.agency, signal })
                    p.enterprise = enterprise.slug
                    p.agency = agency.slug

                    tb.push(p)
                }
                setData(prev => {
                    return {
                        ...prev,
                        personal: tb
                    }
                })

            }
            get()
        }

    }, [menu, dispatch, user])


    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_RESPONSABLE_RH") ? <Submit onClick={() => handleModal("title")}>Fonctions</Submit> : undefined}
            {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_RESPONSABLE_RH") ? <Submit onClick={() => handleModal("personal")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.personal} headers={personals.header} emptyMessage="Aucun personnel trouvé." globalFilterFields={personals.global} sheet="Personnel" titleRef="Mise à jour informations d'un employé" size="lg:h-6/9 lg:w-8/15 xl:h-7/9" />
        <Modal ref={dialog} size="lg:h-6/11 lg:w-12/15 overflow-auto" title="Informations sur les fonctions">
            <Title />
        </Modal>
        <Modal ref={dialog1} size="lg:h-6/9 lg:w-8/15" title="Créer un employé">
            <CreatePersonal />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
})