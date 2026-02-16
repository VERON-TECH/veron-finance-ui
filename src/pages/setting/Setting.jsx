import { useEffect } from "react"
import { identifierMenuActions } from "../../store/identifierSlice"
import { useDispatch, useSelector } from "react-redux"

export default function SettingPage() {
    const menu = useSelector(state => state.identifier.menu)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "setting" }))
    }, [menu, dispatch])
    return <>
        setting Page
    </>
}