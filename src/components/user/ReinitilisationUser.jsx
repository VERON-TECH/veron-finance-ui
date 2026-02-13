import { useDispatch } from "react-redux";
import { noteActions } from "../../store/noteSlice";
import responseHttp from "../../utils/responseHttp";
import { modalActions } from "../../store/modalSlice";
import { reinitialize } from "../../utils/http";
import Submit from "../../layout/Submit";

export default function ReinitialisationUser({ username }) {
    const dispatch = useDispatch()
    async function handleReinitialize() {
        async function get() {
            const responseData = await reinitialize(username)

            const state = responseHttp(responseData);
            if (state) {
                dispatch(noteActions.error(true))
            } else {
                dispatch(noteActions.error(false))
            }
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(responseData))
            dispatch(modalActions.updateClose())

        }
        get()

    }

    function handleCloseModal() {
        dispatch(modalActions.updateClose())
    }
    return <>
        <p className="text-center">Souhaitez-vous vraiment réinitialiser l'utilisateur {username}?</p>
        <form>
            <div className="flex justify-center gap-4 mt-4">
                <Submit formAction={handleReinitialize}>
                    Oui
                </Submit>
                <Submit formAction={handleCloseModal}>
                    Non
                </Submit>
            </div>
        </form>
    </>
}