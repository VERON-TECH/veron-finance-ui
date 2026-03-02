import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activatePrint, disablePrint, getAgencyById, getEnterpriseById, getPrint } from "../../utils/http";
import Input from "../../layout/Input";
import responseHttp from "../../utils/responseHttp";
import { noteActions } from "../../store/noteSlice";


export default function UpdatePrint() {
    const inputEnterprise = useRef();
    const inputAgency = useRef();
    const inputPrint = useRef();
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("user"))
    const id = useSelector(state => state.modal.value)
    const [data, setData] = useState({
        enterprise: "",
        agency: "",
        type: "",
        status: false
    })

    useEffect(() => {
        async function get(signal) {
            const print = await getPrint({ signal, id })
            const enterprise = await getEnterpriseById({ id: print.enterprise, signal })
            const agency = await getAgencyById({ id: print.agency, signal })
            setData(prev => {
                return {
                    ...prev,
                    enterprise: enterprise.slug,
                    agency: agency.slug,
                    type: print.type,
                    status: print.status
                }
            })
        }
        get()
    }, [id])


    async function handleClick(identifier, value, signal) {
        if (value == true) {
            const printTypeDto = {
                enterprise: inputEnterprise.current.value,
                agency: inputAgency.current.value,
                typePrint: inputPrint.current.value
            }
            const responseData = await activatePrint(printTypeDto)
            const state = responseHttp(responseData);
            if (state) {
                dispatch(noteActions.error(true))
            } else {
                dispatch(noteActions.error(false))
            }
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(responseData))
        } else {
            const printTypeDto = {
                enterprise: inputEnterprise.current.value,
                agency: inputAgency.current.value,
                typePrint: inputPrint.current.value
            }
            const responseData = await disablePrint(printTypeDto)
            const state = responseHttp(responseData);
            if (state) {
                dispatch(noteActions.error(true))
            } else {
                dispatch(noteActions.error(false))
            }
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(responseData))
        }

        const print = await getPrint({ signal, id })
        const enterprise = await getEnterpriseById({ id: print.enterprise, signal })
        const agency = await getAgencyById({ id: print.agency, signal })
        setData(prev => {
            return {
                ...prev,
                enterprise: enterprise.slug,
                agency: agency.slug,
                type: print.type,
                status: print.status
            }
        })

    }


    return <>
        <div className="flex flex-col justify-between gap-2">
            <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Nom de l'entreprise" className="border border-sky-950" ref={inputEnterprise} readOnly />
            <Input label="Agence *" type="text" defaultValue={data?.agency} name="agency" placeholder="Nom de l'agence" className="border border-sky-950" ref={inputAgency} readOnly />
            <Input label="Imprimante *" type="text" defaultValue={data?.type} name="typePrint" placeholder="Type d'imprimante" className="border border-sky-950" ref={inputPrint} />
            <div className="flex gap-2 justify-center">
                <label htmlFor="status" className="font-medium text-sky-950">Statut</label>
                <input type="checkbox" id="status" checked={data?.status === "ACTIVE" ? true : false} onClick={(e) => handleClick("status", e.target.checked)} />
            </div>
        </div>
    </>

}