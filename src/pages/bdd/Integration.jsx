import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { identifierMenuActions } from "../../store/identifierSlice"
import { dataEntities } from "../../data/info"
import CardIntegrationBdd from "../../components/bdd/CardIntegrationBdd"
import Notification from "../../layout/Notification"

export default function IntegrationPage() {
    const dispatch = useDispatch()
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const [data] = useState({
        dataEntities: dataEntities.sort((a, b) => a.name + b.name),
    })

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "data" }))
    })
    return <div className="flex justify-center flex-wrap gap-8 w-full bg-sky-100 border rounded p-8">
        {data?.dataEntities.map(d => (<CardIntegrationBdd name={d.name} type={d.value} key={d.key} />))}
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </div>
}