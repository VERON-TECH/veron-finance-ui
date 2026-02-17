import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpents, getSpentFamilyById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { spents } from "../../data/dataTable.js";
import CreateSpent from "../../components/budget/CreateSpent.jsx";
import FamilySpent from "../../components/budget/FamilySpent.jsx";
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";




export default function SpentPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        spend: [],
        isLoading: false
    })

    const dialog = useRef()
    const dialog1 = useRef()

    function handleModal(identifier) {
        if (identifier === "family") {
            dialog1.current.open();
        }

        if (identifier === "spent") {
            dialog.current.open();
        }

    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "budget" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")) {
            async function get(signal) {
                const allSpend = await getAllSpents()
                let tb = []
                let family = {}

                for (let s of allSpend) {
                    family = await getSpentFamilyById({ id: s.spentFamily, signal })
                    s.spentFamily = family.slug

                    tb.push(s)
                }
                setData(prev => {
                    return {
                        ...prev,
                        spend: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={() => handleModal("family")}>Famille de dépenses</Submit> : undefined}
            {user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={() => handleModal("spent")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.spend} headers={spents.header} emptyMessage="Aucune dépense trouvé." globalFilterFields={spents.global} sheet="Dépense" titleRef="Mise à jour informations d'une dépense" size="lg:h-5/13 lg:w-4/15 xl:h-6/13" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        <Modal ref={dialog} size="lg:h-5/12 lg:w-4/15 xl:h-5/13" title="Créer une dépense">
            <CreateSpent />
        </Modal>

        <Modal ref={dialog1} size="lg:h-6/11 lg:w-12/15" title="Famille de dépense">
            <FamilySpent />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}