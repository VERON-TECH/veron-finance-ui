import { useEffect, useState } from "react"

export default function useTypeCash(types) {
    const [typeC, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        let tb = []
        types.forEach(t => {
            user.role.forEach(r => {
                if (t.role.includes(r)) {
                    tb.push({ key: t.key, name: t.name, value: t.value })
                }
            })
        })
        setData(tb)
    }, [])
    return { typeC }
}