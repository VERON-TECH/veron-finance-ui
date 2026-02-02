import { useDispatch, useSelector } from "react-redux";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { useEffect } from "react";

export default function FinancialPage() {
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "financial" }))
    }, [menu, dispatch])

    return <>
        Hello financialPage
    </>
}