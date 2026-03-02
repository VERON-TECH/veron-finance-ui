import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { identifierMenuActions } from "../../store/identifierSlice"
import { dataEntities } from "../../data/info"
import CardData from "../../components/bdd/CardData"
import useData from "../../hooks/useData"
import { useNavigate } from "react-router-dom"


export default function BddPage() {
    const { data } = useData(dataEntities)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "data" }))

    }, [])

    return <>
        <div className="bg-sky-100 flex flex-wrap justify-center gap-4 w-full border border-sky-950/50 rounded p-8 mt-2">
            {data?.map(d =>
                <CardData key={d.key} name={d.name} date={d.date} value={d.value} />
            )}
        </div>

    </>
}