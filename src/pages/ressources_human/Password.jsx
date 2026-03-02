import { useEffect, useRef } from "react"
import { identifierMenuActions } from "../../store/identifierSlice"
import { useDispatch, useSelector } from "react-redux"
import Submit from "../../layout/Submit"
import { isNotEmpty } from "../../utils/validation"
import { useAnimate } from "framer-motion"
import { editPassword } from "../../utils/http"
import responseHttp from "../../utils/responseHttp"
import { noteActions } from "../../store/noteSlice"
import Notification from "../../layout/Notification"

export default function PasswordPage() {
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("user"))
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const menu = useSelector(state => state.identifier.menu)
    const inputPassword = useRef()
    const inputConfirmationPassword = useRef()
    const [animate] = useAnimate()
    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "password" }))

    }, [menu, dispatch])

    async function handleClick() {
        let errors = []
        if (!isNotEmpty(inputPassword.current.value)) {
            animate(inputPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner le mot de passe")
        }

        if (!isNotEmpty(inputConfirmationPassword.current.value)) {
            animate(inputConfirmationPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez confirmer le mot de passe")
        }

        if (inputConfirmationPassword.current.value !== inputPassword.current.value) {
            animate(inputPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            animate(inputConfirmationPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Les mots de passe ne sont pas identiques")
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


        const userEditPasswordDto = {
            password: inputPassword.current.value,
            confirmationPassword: inputConfirmationPassword.current.value
        }
        const responseData = await editPassword(user?.username, userEditPasswordDto)
        const state = responseHttp(responseData);
        if (state) {
            dispatch(noteActions.error(true))
        } else {
            dispatch(noteActions.error(false))
        }
        dispatch(noteActions.show());
        dispatch(noteActions.relaunch());
        dispatch(noteActions.sendData(responseData))
        return { errors: null }
    }

    return <>
        <div className="bg-sky-950 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border w-1/3 h-1/3 rounded shadow-md shadow-sky-950">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between gap-2">
                <div className="mb-2 flex">
                    <label htmlFor="password" className="w-28 text-sky-50">Mot de passe *</label>
                    <input type="password" name="password" placeholder="Mot de passe" id="password" className="bg-sky-50 text-sky-950 rounded p-1 w-48" ref={inputPassword} />
                </div>
                <div className="mb-2 flex">
                    <label htmlFor="confirmationPassword" className="w-28 text-sky-50">Confirmer *</label>
                    <input type="password" name="confirmationPassword" placeholder="Confirmer" id="confirmationPassword" className="bg-sky-50 text-sky-950 rounded p-1 w-48" ref={inputConfirmationPassword} />
                </div>
                <Submit onClick={handleClick}>
                    Enregistrer
                </Submit>
            </div>
        </div>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}