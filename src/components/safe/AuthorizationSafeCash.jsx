import { useQuery } from "@tanstack/react-query";
import { getAgencyById, getAllCashesSafeAuthorization, getEnterpriseById } from "../../utils/http";
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { cashes } from "../../data/dataTable.js";
import AuhtorizeAgency from "../global/AuthorizeAgency.jsx";
import { useDispatch, useSelector } from "react-redux";



export default function AuthorizationSafeCash() {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = useSelector(state => state.modal.value)
    const [data, setData] = useState({
        cash: []
    })

    useEffect(() => {
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") && id != "") {
            async function get(signal) {
                const allCashes = await getAllCashesSafeAuthorization({ signal, id })
                let tb = []
                let enterprise = {}
                let agency = {}
                for (let c of allCashes) {
                    enterprise = await getEnterpriseById({ id: c.enterprise, signal })
                    agency = await getAgencyById({ id: c.agency, signal })
                    c.enterprise = enterprise.slug
                    c.agency = agency.slug
                    tb.push(c)
                }
                setData(prev => {
                    return {
                        ...prev,
                        cash: tb
                    }
                })

            }
            get()
        }
    }, [id])


    const dialog = useRef()

    function handleModal(identifier) {
        if (identifier === "authorization") {
            dialog.current.open();
        }

    }

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={() => handleModal("authorization")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.cash} headers={cashes.header} emptyMessage="Aucune caisse autorisée trouvée." globalFilterFields={cashes.global} sheet="Caisses autorisées" titleRef="Supprimer l'autorisation dans un coffre-fort" size="lg:h-2/12 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-4/11 lg:w-4/15 xl:h-5/11" title="Autoriser une caisse">
            <AuhtorizeAgency type="safe" id={id} />
        </Modal>

    </>
}