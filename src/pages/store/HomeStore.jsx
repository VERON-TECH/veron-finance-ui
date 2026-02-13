import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { identifierMenuActions } from "../../store/identifierSlice"

export default function HomeStorePage() {
    const menu = useSelector(state => state.identifier.menu)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "store" }))
    }, [menu, dispatch])
    return <>
        Hello Home Store Page
    </>
}