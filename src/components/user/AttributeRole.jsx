
import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useRef } from "react";
import { useDispatch } from "react-redux";
import { attributeRole, queryClient } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { roles } from "../../data/info.js";

export default function AttributeRole({ username }) {

    const selectRole = useRef();

    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();


    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];

        const role = formData.get("role")



        if (role === null) {
            animate(selectRole.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner le rôle.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {

                errors,
            }
        }


        mutate({ username, attributeRoleDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: attributeRole,
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
            queryClient.cancelQueries(["users"])
        }
    })



    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>

            <div className="flex flex-col justify-between gap-2">
                <Select label="Rôles *" id="role" name="role" selectedTitle="Sélectionner un role" data={roles} ref={selectRole} />
            </div>


            <Submit>
                Enregistrer
            </Submit>
        </form>


    </>
}