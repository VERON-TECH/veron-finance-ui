import { useEffect, useRef, useState } from "react";
import Modal from "../../layout/Modal";
import Submit from "../../layout/Submit";
import { getAgencyBySlug, getAllAgenciesByEnterprise, getAllEnterprises, getAllMvtCash, getAllMvtSalesByDate, getCategoryServiceById, getEnterpriseBySlug, getServiceById, getSpentBySlug } from "../../utils/http";
import { identifierMenuActions } from "../../store/identifierSlice";
import { useDispatch } from "react-redux";
import Input from "../../layout/Input";
import Select from "../../layout/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { printActions } from "../../store/print";
import { useNavigate } from "react-router-dom";
import Logo from "../../layout/LogoDark";

export default function ReportPage() {
    const user = JSON.parse(localStorage.getItem("user"))
    const dialog = useRef()
    const [item, setItem] = useState({
        enterprise: [],
        agency: []
    })
    const inputStartDate = useRef()
    const inputEndDate = useRef()
    const selectEnterprise = useRef()
    const selectAgency = useRef()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "data" }))
        async function get() {
            const allEnterprises = await getAllEnterprises()
            let enterprise = []
            for (let e of allEnterprises) {
                enterprise.push({ key: e.id, name: e.name, value: e.slug })
            }
            setItem(prev => {
                return {
                    ...prev,
                    enterprise
                }
            })
        }
        get()

    }, [])

    function handleClick() {
        dialog.current.open()
    }

    async function handleChange(identifier, value, signal) {
        if (identifier === "enterprise") {
            const enterprise = await getEnterpriseBySlug({ slug: value, signal })
            const allAgencies = await getAllAgenciesByEnterprise(enterprise.id)
            let agency = []
            for (let a of allAgencies) {
                agency.push({ key: a.id, name: a.name, value: a.slug })
            }
            setItem(prev => {
                return {
                    ...prev,
                    agency,
                    isLoading: false
                }
            })
        }
    }


    async function handlePrint() {
        setItem(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        const controler = new AbortController()
        const signal = controler.signal
        const enterprise = await getEnterpriseBySlug({ slug: selectEnterprise.current.value, signal })
        const agency = await getAgencyBySlug({ slug: selectAgency.current.value, signal })
        const startDate = inputStartDate.current.value
        const endDate = inputEndDate.current.value
        const allSales = await getAllMvtSalesByDate({ signal, startDate, endDate })
        const allMvtCashes = await getAllMvtCash({ signal, enterprise: enterprise.id, agency: agency.id, cash: 0, startDate, endDate })
        const period = {
            startDate,
            endDate
        }

        const categories = []
        const services = []
        let spend = []
        let amountService = 0
        let amountSpent = 0
        let verificationCategory = new Set()
        let verificationService = new Set()
        for (let s of allSales) {
            amountService += s.priceTTC
            const service = await getServiceById({ signal, id: s.service })
            const category = await getCategoryServiceById({ id: service.id, signal })
            if (categories.length > 0) {
                categories.forEach(c => {
                    if (verificationCategory.has(category.name)) {
                        for (let v of verificationService) {
                            if (v === c.name) {
                                c.number += 1
                                c.amount += s.priceTTC
                            }
                        }

                    } else {
                        categories.push({ key: 1, name: category.name, number: 1, amount: s.priceTTC })
                        verificationCategory.add(category.name)
                    }
                })
            } else {
                categories.push({ name: category.name, number: 1, amount: s.priceTTC })
                verificationCategory.add(category.name)
            }


            if (services.length > 0) {
                services.forEach(sv => {
                    if (verificationService.has(service.name)) {
                        for (let v of verificationService) {
                            if (v === sv.name) {
                                sv.number += 1
                                sv.amount += s.priceTTC
                            }
                        }

                    } else {
                        services.push({ category: category.name, name: service.name, number: 1, amount: s.priceTTC })
                        verificationService.add(service.name)
                    }
                })
            } else {
                services.push({ category: category.name, name: service.name, number: 1, amount: s.priceTTC })
                verificationService.add(service.name)
            }
        }


        for (let s of allMvtCashes) {
            if (s.type === "DEPENSES") {
                amountSpent += s.amount
                const spent = await getSpentBySlug({ id: s.motif, signal })
                if (spend.length > 0) {
                    spend.forEach(s => {
                        if (s.name === spent.name) {
                            s.key += 1
                            s.amount = s.amount

                        } else {
                            spend.push({ key: 1, name: spent.name, amount: s.amount })
                        }

                    })
                } else {
                    spend.push({ key: 1, name: spent.name, amount: s.amount })
                }
            }
        }
        const date = new Date().toLocaleDateString()


        const printReport = {
            enterprise,
            agency,
            period,
            date,
            categories,
            services,
            amountService,
            amountSpent,
            spend,
            difference: amountService - amountSpent
        }
        dispatch(printActions.getPrint(printReport))
        navigate("/print-report")
        setItem(prev => {
            return {
                ...prev,
                isLoading: false
            }
        })


    }
    return <>

        {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={handleClick}>Rapport d'activité</Submit> : undefined}
        <Logo position="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2" className="animate-bounce" />


        <Modal ref={dialog} size="lg:h-5/12 lg:w-4/15 xl:h-6/12" title="Rapport d'activité">
            <div className="flex flex-col gap-2">
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={item?.enterprise} ref={selectEnterprise} onChange={(e) => handleChange("enterprise", e.target.value)} />
                <Select label="Agence *" id="agency" name="agency" selectedTitle="Sélectionner une agence" data={item?.agency} ref={selectAgency} />
                <Input label="Date de début *" type="date" name="startDate" className="border" ref={inputStartDate} />
                <Input label="Date de fin *" type="date" name="endDate" className="border" ref={inputEndDate} />
                <div className="flex justify-center gap-4">
                    <Submit onClick={handlePrint}>
                        Imprimer
                    </Submit>
                    {item.isLoading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                </div>
            </div>
        </Modal>

    </>
}