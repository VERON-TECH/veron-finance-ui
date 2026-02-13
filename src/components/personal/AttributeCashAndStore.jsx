import { useActionState, useEffect, useRef, useState } from "react"
import { authorizeCashPersonal, authorizeStorePersonal, getAllCashes, getAllStores, getPersonalById, queryClient } from "../../utils/http"
import Select from "../../layout/Select"
import Submit from "../../layout/Submit";
import { useMutation } from "@tanstack/react-query";
import responseHttp from "../../utils/responseHttp";
import { noteActions } from "../../store/noteSlice";
import { useDispatch } from "react-redux";
import { useAnimate } from "framer-motion";

export default function AttributeCashAndStore({ id }) {
    const dispatch = useDispatch()
    const [scope, animate] = useAnimate()
    const selectCash = useRef();
    const selectStore = useRef();
    const [data, setData] = useState({
        identifier: "cash",
        personal: {},
        enterprise: "",
        agency: "",
        cashes: [],
        stores: []
    })


    useEffect(() => {
        let tb = []
        let tb2 = []
        if (id !== "" && id !== undefined) {
            async function get(signal) {
                const personal = await getPersonalById({ id, signal })
                const allCashes = await getAllCashes({ signal, enterprise: personal.enterprise, agency: personal.agency })
                const allStores = await getAllStores({ signal, enterprise: personal.enterprise, agency: personal.agency })
                allCashes.forEach(c => {
                    tb.push({ key: c.id, name: c.name, value: c.slug })
                })
                allStores.forEach(s => {
                    tb2.push({ key: s.id, name: s.name, value: s.slug })
                })
                setData(prev => {
                    return {
                        ...prev,
                        personal,
                        cashes: tb,
                        stores: tb2
                    }

                })
            }
            get()

        }


    }, [id])


    function handleClick(identifier) {
        setData(prev => {
            return {
                ...prev,
                identifier
            }

        })
    }

    function handleSubmit(prev, formData) {
        let errors = []
        if (data.identifier === "cash") {
            const cash = formData.get("cash")
            if (cash === null) {
                errors.push("Veuillez sélectionner la caisse.")
            }

            if (errors.length > 0) {
                return { errors }
            }

            mutate({ slug: cash, slugPersonal: data?.personal.slug })
            return { errors: null }
        }

        if (data.identifier === "store") {
            const store = formData.get("store")
            if (store === null) {
                errors.push("Veuillez sélectionner un magasin.")
            }

            if (errors.length > 0) {
                return { errors }
            }


            mutate({ slug: store, storeAuthorizePersonalDto: { personal: data?.personal.slug } })
            return { errors: null }
        }
    }


    const { mutate } = useMutation({
        mutationFn: data?.identifier === "cash" ? authorizeCashPersonal : data?.identifier === "store" ? authorizeStorePersonal : undefined,
        onSuccess: (responseData) => {
            const state = responseHttp(responseData);
            if (state) {
                dispatch(noteActions.error(true))
            } else {
                dispatch(noteActions.error(false))
            }
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(responseData))
            queryClient.cancelQueries(["cashes"])
        }
    })



    const [formState, formAction] = useActionState(handleSubmit, { errors: null })

    return <>
        <nav className="bg-sky-950 rounded mb-4">
            <ul className="text-sky-50 flex gap-10 p-1 px-4">
                <li className="cursor-pointer hover:border-b-3" onClick={() => handleClick("cash")}>Caisses</li>
                <li className="cursor-pointer hover:border-b-3" onClick={() => handleClick("store")}>Magasins</li>
            </ul>
        </nav>

        <form action={formAction} className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            {data?.identifier === "cash" && <div className="flex justify-center">
                <Select label="Caisses*" id="cash" name="cash" selectedTitle="Sélectionner une caisse" data={data?.cashes} ref={selectCash} />
            </div>}
            {data?.identifier === "store" && <Select label="Magasins*" id="store" name="store" selectedTitle="Sélectionner un magasin" data={data?.stores} ref={selectStore} />}
            <Submit>
                Enregistrer
            </Submit>
        </form>
    </>
}