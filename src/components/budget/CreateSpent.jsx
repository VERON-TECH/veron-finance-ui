import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createSpent, getAllFamily, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";

export default function CreateSpent() {


    const selectSpentFamily = useRef();
    const inputName = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        spentFamilies: [],
    })

    useEffect(() => {
        let tbEl = {
            tb: [],
        }
        async function get() {
            const allFamily = await getAllFamily()
            allFamily.forEach(f => {
                tbEl.tb.push({ key: f.id, name: f.name, value: f.slug })
            })


            setData(prev => {
                return {
                    ...prev,
                    spentFamilies: tbEl.tb,
                }
            })
        }
        get()

    }, [])

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const spentFamily = formData.get("spentFamily")
        const name = formData.get("name")


        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom du magasin.")
        }

        if (spentFamily === null) {
            animate(selectSpentFamily.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la famille de dépense.")
        }



        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors, enteredValue: {
                    name,
                }
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createSpent,
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
            queryClient.cancelQueries(["spents"])
        }
    })


    function handleBlur(field, value) {

        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

    }

    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Select label="Famille *" id="spentFamily" name="spentFamily" selectedTitle="Sélectionner une famille de dépense" data={data?.spentFamilies} ref={selectSpentFamily} />
                <Input label="Nom *" type="text" defaultValue={formState.enteredValue?.name} name="name" placeholder="Nom de la dépense" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />
            </div>
            <Submit>
                Créer
            </Submit>
        </form>


    </>

}