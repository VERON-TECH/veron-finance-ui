import { useSelector } from "react-redux";
import PrintSalePayment from "../../components/print/PrinSalePayment";


export default function PrintSalePage() {
    const printType = useSelector(state => state.identifier.print)
    return (
        <>
            {printType === "IMPRIMANTE_PAPIER_THERMIQUE" && <><PrintSalePayment />
                <PrintSalePayment /></>}
            {printType === "IMPRIMANTE_MATRICIELLE" && <><PrintSalePayment /></>}
            {printType === "IMPRIMANTE_LASER" && <><PrintSalePayment /></>}
        </>
    );
}
