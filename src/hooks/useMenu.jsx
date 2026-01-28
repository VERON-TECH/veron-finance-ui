import { useEffect, useState } from "react"

export default function useMenu(features) {
  const [data, setData] = useState([])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    let tab = [];
    features.forEach(feature => {
      user?.role.forEach(auth => {
        if (feature.role.length > 0) {
          if (feature.role.includes(auth)) {
            tab.push({ key: feature.key, menu: feature.menu, path: feature.path })
          }
        }
      })
    })
    setData(tab)
  }, [features])
  return { data }
}
