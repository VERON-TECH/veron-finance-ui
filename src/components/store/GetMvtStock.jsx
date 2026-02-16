import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getMvtStock } from "../../utils/http"
import Input from "../../layout/Input"

export default function GetMvtStock() {
    const id = useSelector(state => state.modal.value)
    const [data, setData] = useState({
        mvtStock: {}
    })
    useEffect(() => {
        async function get(signal) {
            const mvtStock = await getMvtStock({ signal, id })
            setData(prev => {
                return {
                    ...prev,
                    mvtStock
                }
            })
        }
        get()
    }, [id])

    return <div>
        <div className="flex justify-between gap-2">
            <Input label="Date" id="dateTransaction" type="date" defaultValue={data?.mvtStock.dateTransaction} name="dateTransaction" className="border border-sky-950" readOnly />
            <Input label="Réf" id="ref" type="text" defaultValue={data?.mvtStock.ref} name="ref" className="border border-sky-950" readOnly />
        </div>
        <div className="flex justify-between gap-2">
            <Input label="Magasin 1" id="store01" type="text" defaultValue={data?.mvtStock.storePrincipal != "" ? data?.mvtStock.storePrincipal : data?.mvtStock.store01} name="store01" className="border border-sky-950" readOnly />
            <Input label="Magasin 2" id="store02" type="text" defaultValue={data?.mvtStock.storePrincipal != "" ? data?.mvtStock.storePrincipal : data?.mvtStock.store02} name="store02" className="border border-sky-950" readOnly />
        </div>

        <div className="flex justify-between gap-2">
            <Input label="Article" id="product" type="text" defaultValue={data?.mvtStock?.product} name="product" className="border border-sky-950" readOnly />
            <Input label="Quantité" id="quantity" type="number" defaultValue={data?.mvtStock.incoming > 0 ? data?.mvtStock.incoming : data?.mvtStock.outgoing} name="quantity" className="border border-sky-950" readOnly />
        </div>
    </div>
}