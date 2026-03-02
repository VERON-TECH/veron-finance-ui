import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getAgencyById, getEnterpriseById, getLotById, getProductById, getStock, getStockById, getStoreById, getStorePrincipalById } from "../../utils/http"
import Input from "../../layout/Input"

export default function GetStock() {
    const id = useSelector(state => state.modal.value)
    const [data, setData] = useState({
        enterprise: "",
        agency: "",
        storePrincipal: "",
        store: "",
        product: "",
        lot: "",
        stock: 0,
        state: ""
    })

    useEffect(() => {
        if (id !== "") {
            async function get(signal) {
                const stock = await getStockById({ signal, id })
                const enterprise = await getEnterpriseById({ id: stock.enterprise, signal })
                const agency = await getAgencyById({ id: stock.enterprise, signal })
                const storePrincipal = await getStorePrincipalById({ id: stock.storePrincipal, signal })
                const store = await getStoreById({ id: stock.store, signal })
                const product = await getProductById({ signal, id: stock.product })
                const lot = await getLotById({ signal, id: stock.lot })
                setData(prev => {
                    return {
                        ...prev,
                        enterprise: enterprise.slug,
                        agency: agency.slug,
                        storePrincipal: storePrincipal.slug,
                        store: store.slug,
                        product: product.slug,
                        lot: lot.slug,
                        stock: stock.stock,
                        state: stock.state
                    }
                })
            }
            get()
        }
    }, [id])
    return <>
        <div className="flex justify-center gap-4">
            <Input label="Enterprise *" type="text" name="enterprise" defaultValue={data?.enterprise} className="border border-sky-950" readOnly />
            <Input label="Enterprise *" type="text" name="agency" defaultValue={data?.agency} className="border border-sky-950" readOnly />
        </div>
        <div className="flex justify-center gap-4">
            <Input label="Magasin principal *" type="text" name="storePrincipal" defaultValue={data?.storePrincipal} className="border border-sky-950" readOnly />
            <Input label="Magasin *" type="text" name="store" defaultValue={data?.store} className="border border-sky-950" readOnly />
        </div>
        <div className="flex justify-center gap-4">
            <Input label="Produit *" type="text" name="product" defaultValue={data?.product} className="border border-sky-950" readOnly />
            <Input label="Lot *" type="text" name="lot" defaultValue={data?.lot} className="border border-sky-950" readOnly />
        </div>
        <div className="flex justify-center gap-4">
            <Input label="Stock *" type="text" name="stock" defaultValue={data?.stock} className="border border-sky-950" readOnly />
            <Input label="Statut *" type="text" name="state" defaultValue={data?.state} className="border border-sky-950" readOnly />
        </div>
    </>
}