import { useEffect, useState } from "react"

export default function useData(dataEntities) {
    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        let tb = []
        for (let d of dataEntities) {
            for (let r of d.role) {
                if (user.role.includes(r)) {
                    tb.push({ key: d.key, name: d.name, value: d.value, date: d.date })
                }
            }
            setData(tb)
        }
    }, [])

    return { data }
}