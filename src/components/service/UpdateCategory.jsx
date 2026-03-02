import { useMutation, useQuery } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryServiceById, queryClient, updateCategoryService } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"

export default function UpdateCategory() {
    const inputName = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"))

    const id = useSelector(state => state.modal.value)
    const { data } = useQuery({
        queryKey: ["categories", { id }],
        queryFn: ({ signal }) => getCategoryServiceById({ id, signal }),
        enabled: user?.role.includes("ROLE_GESTIONNAIRE_DE_STOCK") && id != "" && id !== undefined || user?.role.includes("ROLE_COMPTABLE") && id != "" && id !== undefined
    })



    async function handleSubmit(prevState, formData, signal) {
        let errors = [];
        const allData = Object.fromEntries(formData.entries())
        const name = formData.get("name")

        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom de la catégorie.")
        }



        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors
            }
        }
        const categoryService = await getCategoryServiceById({ id, signal })


        mutate({ slug: categoryService.slug, categoryServiceDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateCategoryService,
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
            queryClient.cancelQueries(["banks"])
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
                <Input label="Nom*" type="text" defaultValue={data?.name} name="name" placeholder="Nom de la catégorie" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />

            </div>

            <Submit>
                Enregistrer
            </Submit>
        </form>


    </>

}