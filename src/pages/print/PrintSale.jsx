import { useSelector } from "react-redux";
import PrintSale from "../../components/print/PrintSale";


export default function PrintSalePage() {
    const printType = useSelector(state => state.identifier.print)
    return (
        <>
            {printType === "IMPRIMANTE_PAPIER_THERMIQUE" && <><PrintSale />
                <PrintSale /></>}
            {printType === "IMPRIMANTE_MATRICIELLE" && <><PrintSale /></>}
            {printType === "IMPRIMANTE_LASER" && <><PrintSale /></>}
        </>
    );
}
