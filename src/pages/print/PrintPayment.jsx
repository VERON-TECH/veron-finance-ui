import { useSelector } from "react-redux";
import PrintPayment from "../../components/print/PrintPayment";


export default function PrintPaymentPage() {
    const printType = useSelector(state => state.identifier.print)
    return (
        <>
            {printType === "IMPRIMANTE_PAPIER_THERMIQUE" && <><PrintPayment />
                <PrintPayment /></>}
            {printType === "IMPRIMANTE_MATRICIELLE" && <><PrintPayment /></>}
            {printType === "IMPRIMANTE_LASER" && <><PrintPayment /></>}
        </>
    );
}
