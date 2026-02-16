import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllEngagements, getEnterpriseById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useState } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { engagements } from "../../data/dataTable.js";



export default function EngagementPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        engagement: []
    })



    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "engagement" }))
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")) {
            async function get(signal) {
                const allEngagements = await getAllEngagements({ signal, enterprise: user?.enterprise, agency: user?.agency })
                let tb = []
                let enterprise = {}
                let agency = {}
                for (let e of allEngagements) {
                    enterprise = await getEnterpriseById({ id: e.enterprise, signal })
                    agency = await getAgencyById({ id: e.agency, signal })
                    e.enterprise = enterprise.slug
                    e.agency = agency.slug
                    tb.push(e)
                }
                setData(prev => {
                    return {
                        ...prev,
                        engagement: tb
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>

        <Table data={data?.engagement} headers={engagements.header} emptyMessage="Aucun engagement trouvé." globalFilterFields={engagements.global} sheet="Engagement" titleRef="Visualiser les engagements" size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" />

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}