import { useDispatch, useSelector } from "react-redux";
import Submit from "../../layout/Submit";
import { getAgencyById, getCashById, unAuthorizeAgencyBank, unAuthorizeAgencyMobileMoney, unAuthorizeAgencyStorePrincipal, unAuthorizeCashSafe } from "../../utils/http";
import responseHttp from "../../utils/responseHttp";
import { noteActions } from "../../store/noteSlice";
import { modalActions } from "../../store/modalSlice";

export default function ConfirmationDelete({ authorize }) {
    const id = useSelector(state => state.modal.value)
    const rib = useSelector(state => state.stateTable.rib)
    const slugMobile = useSelector(state => state.stateTable.mobileMoneySlug)
    const slugStorePrincipal = useSelector(state => state.stateTable.storePrincipalSlug)
    const slugSafe = useSelector(state => state.stateTable.safeSlug)
    const dispatch = useDispatch();


    async function handleUnAuthorize() {
        async function get(signal) {
            let responseData = [];
            let isExecute = false
            if (authorize === "bank") {
                const agency = await getAgencyById({ id, signal })
                responseData = await unAuthorizeAgencyBank({ slug: agency.slug, rib })
                isExecute = true
            } else if (authorize === "mobile") {
                const agency = await getAgencyById({ id, signal })
                responseData = await unAuthorizeAgencyMobileMoney({ slug: agency.slug, slugMobile })
                isExecute = true
            } else if (authorize === "storePrincipal") {
                const agency = await getAgencyById({ id, signal })
                responseData = await unAuthorizeAgencyStorePrincipal({ slug: agency.slug, slugStorePrincipal })
                isExecute = true
            } else if (authorize === "safe") {
                const cash = await getCashById({ id, signal })
                responseData = await unAuthorizeCashSafe({ slug: cash.slug, slugSafe })
                isExecute = true
            }

            if (isExecute) {
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

        }
        get()

    }

    function handleCloseModal() {
        dispatch(modalActions.updateClose())
    }

    return <>
        <p className="font-medium">Souhaitez-vous supprimer les autorisations de l'entité {id}?</p>
        <form>
            <div className="flex justify-center gap-4 mt-4">
                <Submit formAction={handleUnAuthorize}>
                    Oui
                </Submit>
                <Submit formAction={handleCloseModal}>
                    Non
                </Submit>
            </div>
        </form>

    </>
}