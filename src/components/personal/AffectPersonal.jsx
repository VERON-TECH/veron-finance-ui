import { useActionState, useEffect, useRef, useState } from "react"
import { typeTransfer } from "../../data/info"
import { affectAgencyToAgency, affectEnterpriseToEnterprise, getAgencyById, getAllAgencies, getAllAgenciesByEnterprise, getAllEnterprises, getEnterpriseById, getEnterpriseBySlug, getPersonalById, queryClient } from "../../utils/http"
import Submit from "../../layout/Submit"
import Select from "../../layout/Select"
import { useAnimate } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import responseHttp from "../../utils/responseHttp"
import { noteActions } from "../../store/noteSlice"
import { useDispatch } from "react-redux"

export default function AffectPersonal({ id }) {
    const selectEnterprise01 = useRef()
    const selectEnterprise02 = useRef()
    const selectAgency01 = useRef()
    const selectAgency02 = useRef()
    const [scope] = useAnimate();
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("user"))

    const [data, setData] = useState({
        enterprise01: [],
        enterprise02: [],
        agency01: [],
        agency02: [],
        personal: {},
        type: "ENTREPRISE-->ENTREPRISE"

    })
    useEffect(() => {
        let tbEl = {
            tb: [],
            tb1: []
        }
        async function get(signal) {
            let personal;
            if (id !== "") {
                personal = await getPersonalById({ id, signal })
                const enterprise01 = await getEnterpriseById({ id: personal.enterprise, signal })
                const agency01 = await getAgencyById({ id: personal.agency, signal })
                tbEl.tb.push({ key: enterprise01.id, name: enterprise01.name, value: enterprise01.slug })
                tbEl.tb1.push({ key: agency01.id, name: agency01.name, value: agency01.slug })
            }


            setData(prev => {
                return {
                    ...prev,
                    enterprise01: tbEl.tb,
                    agency01: tbEl.tb1,
                    personal
                }
            })
        }
        get()
    }, [id])


    function handleSubmit(prev, formData) {
        if (data?.type === "ENTREPRISE-->ENTREPRISE") {
            const enterprise01 = formData.get("enterprise01")
            const enterprise02 = formData.get("enterprise02")

            let errors = []

            if (enterprise01 === null) {
                errors.push("Veuillez sélectionner l'entreprise de départ.")
            }

            if (enterprise02 === null) {
                errors.push("Veuillez sélectionner l'entreprise d'arrivée.")
            }

            if (errors.length > 0) {
                return { errors }
            }
            const allData = {
                enterprise01,
                enterprise02
            }
            mutate({ slug: data?.personal?.slug, personalTransfertEnterpriseDto: allData })
        }


        if (data?.type === "AGENCE-->AGENCE") {
            const enterprise01 = formData.get("enterprise01")
            const agency01 = formData.get("agency01")
            const agency02 = formData.get("agency02")

            let errors = []

            if (enterprise01 === null) {
                errors.push("Veuillez sélectionner l'entreprise de départ.")
            }

            if (agency01 === null) {
                errors.push("Veuillez sélectionner l'agence de départ.")
            }

            if (agency02 === null) {
                errors.push("Veuillez sélectionner l'agence d'arrivée'.")
            }

            if (errors.length > 0) {
                return { errors }
            }
            const allData = {
                enterprise01,
                agency01,
                agency02
            }
            mutate({ slug: data?.personal?.slug, personalTransferAgencyDto: allData })
        }
    }

    const { mutate } = useMutation({
        mutationFn: data?.type === "ENTREPRISE-->ENTREPRISE" ? affectEnterpriseToEnterprise : data?.type === "AGENCE-->AGENCE" ? affectAgencyToAgency : undefined,
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
            queryClient.cancelQueries(["personals"])
        }
    })

    const [formstate, formAction] = useActionState(handleSubmit, { errors: null })




    async function handleChange(identifier, value, signal) {
        let tb = []
        if (identifier === "enterprise01") {
            const enterprise02 = await getAllEnterprises()
            enterprise02.forEach(e => {
                if (e.slug !== value) {
                    tb.push({ key: e.id, name: e.name, value: e.slug })
                }
            })
            setData(prev => {
                return {
                    ...prev,
                    enterprise02: tb
                }
            })
        }

        if (identifier === "type") {
            setData(prev => {
                return {
                    ...prev,
                    type: value
                }
            })
        }


        if (identifier === "agency01") {
            const enterprise = await getEnterpriseBySlug({ slug: selectEnterprise01.current.value, signal })
            const agency02 = await getAllAgenciesByEnterprise(enterprise.id)
            agency02.forEach(a => {
                if (a.slug !== value) {
                    tb.push({ key: a.id, name: a.name, value: a.slug })
                }
            })
            setData(prev => {
                return {
                    ...prev,
                    agency02: tb
                }
            })
        }
    }



    return <>
        <div className="flex justify-center">
            <Select label="Type de transfert *" id="type" name="type" selectedTitle="Sélectionner un type de transfert" data={typeTransfer} onChange={(e) => handleChange("type", e.target.value)} />

        </div>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            {data?.type === "ENTREPRISE-->ENTREPRISE" && user?.role.includes("ROLE_ADMIN") ? <>
                <Select label="Entreprise de départ*" id="enterprise01" name="enterprise01" selectedTitle="Sélectionner l'entreprise de départ" data={data?.enterprise01} ref={selectEnterprise01} onChange={(e) => handleChange("enterprise01", e.target.value)} />
                <Select label="Entreprise d'arrivée*" id="enterprise02" name="enterprise02" selectedTitle="Sélectionner l'entrerpise d'arrivée" data={data?.enterprise02} ref={selectEnterprise02} />
            </>
                : undefined}


            {data?.type === "AGENCE-->AGENCE" && user?.role.includes("ROLE_RESPONSABLE_RH") ? <>
                <Select label="Entreprise*" id="enterprise01" name="enterprise01" selectedTitle="Sélectionner une entreprise" data={data?.enterprise01} ref={selectEnterprise01} />
                <Select label="Agence de départ*" id="agency01" name="agency01" selectedTitle="Sélectionner une agence" data={data?.agency01} ref={selectAgency01} onChange={(e) => handleChange("agency01", e.target.value)} />
                <Select label="Agence d'arrivée*" id="agency02" name="agency02" selectedTitle="Sélectionner une agence" data={data?.agency02} ref={selectAgency02} />
            </>
                : undefined}
            {data?.type == "ENTREPRISE-->ENTREPRISE" && user?.role.includes("ROLE_ADMIN") || data?.type == "AGENCE-->AGENCE" && user?.role.includes("ROLE_RESPONSABLE_RH") ? <Submit>
                Enregistrer
            </Submit> : undefined}
        </form>

    </>
}