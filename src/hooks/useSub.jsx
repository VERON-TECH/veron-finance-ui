import { useEffect, useState } from "react"

export default function useSub(menu, features) {
  const user = JSON.parse(localStorage.getItem("user"))
  const [data, setData] = useState([]);
  useEffect(() => {
    let tab = [];
    features?.forEach(feature => {
      user?.role.forEach(auth => {
        if (feature.role.includes(auth) && feature.identifier === menu) {
          tab.push({ key: feature.key, url: feature.url, menu: feature.menu })
        }
      })
    })
    setData(tab);
  }, [menu])
  return { data }
}