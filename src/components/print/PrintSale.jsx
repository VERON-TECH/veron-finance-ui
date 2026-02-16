import { useSelector } from "react-redux";
import Logo from "../../layout/LogoDark"

export default function PrintSale() {
    const print = useSelector(state => state.print);
    const printType = useSelector(state => state.identifier.print)

    const format = (value) =>
        Number(value || 0).toLocaleString();
    const line = "=".repeat(80);
    const dash = "-".repeat(80);
    const formatLine = (name, qty, price, total) => {
        const col1 = name.padEnd(30);
        const col2 = qty.toString().padStart(8);
        const col3 = format(price).padStart(15);
        const col4 = format(total).padStart(15);

        return `${col1}${col2}${col3}${col4}`;
    };

    return <>

        {printType === "IMPRIMANTE_PAPIER_THERMIQUE" && <div
            className="bg-white mx-auto p-6 text-sm font-mono"
            style={{ width: "80mm", minHeight: "auto" }} // ticket thermique
        >

            {/* HEADER */}
            <div className="text-center mb-4">

                <p className="font-bold text-base mt-2">
                    {print.enterprise?.name}
                </p>
                <p>{print.enterprise?.phone}</p>
                <p className="text-xs mt-1">
                    {print.date} - {print.time}
                </p>
            </div>

            <hr className="my-2 border-dashed" />

            {/* CLIENT INFO */}
            <div className="mb-2">
                <p><strong>Client :</strong> {print.customer}</p>
                <p><strong>Agence :</strong> {print.agency?.name}</p>
                <p><strong>Facture N° :</strong> {print.ref}</p>
            </div>

            <hr className="my-2 border-dashed" />

            {/* PRODUITS */}
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b">
                        <th className="text-left">Article</th>
                        <th className="text-center">Qté</th>
                        <th className="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {print.products?.map((p, i) => {
                        const total = p.price * p.quantity;
                        return (
                            <tr key={i} className="border-b">
                                <td>{p.product}</td>
                                <td className="text-center">{format(p.quantity)}</td>
                                <td className="text-right">{format(total)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <hr className="my-2 border-dashed" />

            {/* TOTALS */}
            <div className="text-xs">
                <div className="flex justify-between">
                    <span>Total HT</span>
                    <span>{format(print.priceHT)}</span>
                </div>

                <div className="flex justify-between">
                    <span>Remise</span>
                    <span>{format(print.remise)}</span>
                </div>

                <div className="flex justify-between font-bold text-sm mt-1">
                    <span>Total TTC</span>
                    <span>{format(print.priceTTC)}</span>
                </div>

                <div className="flex justify-between mt-1">
                    <span>Payé</span>
                    <span>{format(print.payment)}</span>
                </div>

                <div className="flex justify-between font-bold">
                    <span>Reste</span>
                    <span>{format(print.rest)}</span>
                </div>
            </div>

            <hr className="my-2 border-dashed" />

            {/* MONTANT EN LETTRE */}
            <p className="text-xs mt-2">
                Arrêté à : <br />
                <strong>{print.amountLetter}</strong>
            </p>

            <p className="text-center font-bold mt-2">
                {print.cash}
            </p>

            <div className="text-center mt-4 text-xs">
                Merci pour votre confiance
            </div>
        </div>}

        {printType === "IMPRIMANTE_MATRICIELLE" && <>
            <pre style={{ fontFamily: "monospace", fontSize: "12px" }}>
                {`
${print.enterprise?.name}
${print.enterprise?.phone || ""}
${print.agency?.name}
${line}

FACTURE N° : ${print.ref}
DATE       : ${print.date} ${print.time}
CLIENT     : ${print.customer || "CLIENT COMPTOIR"}
CAISSIER   : ${print.cash || ""}

${dash}
ARTICLE                       QTE          PU            MT
${dash}
${print.products?.map(p =>
                    formatLine(
                        p.product.substring(0, 30),
                        p.quantity,
                        p.price,
                        p.quantity * p.price
                    )
                ).join("\n")}
${dash}

SOUS TOTAL : ${format(print.priceHT).padStart(58)}
REMISE     : ${format(print.remise).padStart(58)}
TOTAL TTC  : ${format(print.priceTTC).padStart(58)}
PAYE       : ${format(print.payment).padStart(58)}
MONNAIE    : ${format(print.rest).padStart(58)}

${line}

MODE DE PAIEMENT : ${print.cash}
MONTANT EN LETTRE : ${print.amountLetter}

${line}
        MERCI POUR VOTRE CONFIANCE
`}
            </pre>
        </>}

        {printType === "IMPRIMANTE_LASER" && <div
            className="bg-white mx-auto p-10 text-sm"
            style={{ width: "210mm", minHeight: "297mm" }}
        >

            {/* HEADER */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <Logo></Logo>
                    <p className="font-bold mt-2 text-base">
                        {print.enterprise?.name}
                    </p>
                    <p>{print.enterprise?.address}</p>
                    <p>Tel : {print.enterprise?.phone}</p>
                    <p>Email : {print.enterprise?.email}</p>
                </div>

                <div className="text-right">
                    <h1 className="text-2xl font-bold uppercase">
                        Reçu de Vente
                    </h1>
                    <p><strong>Facture N° :</strong> {print.ref}</p>
                    <p><strong>Date :</strong> {print.date}</p>
                    <p><strong>Heure :</strong> {print.time}</p>
                    <p><strong>Caissier :</strong> {print.cash}</p>
                </div>
            </div>

            {/* CLIENT */}
            <div className="border p-4 mb-6 bg-gray-50">
                <p><strong>Client :</strong> {print.customer || "Client Comptoir"}</p>
                <p><strong>Agence :</strong> {print.agency.name}</p>
            </div>

            {/* TABLE PRODUITS */}
            <table className="w-full border-collapse border border-gray-400 mb-6">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2 text-left">Désignation</th>
                        <th className="border p-2 text-center">Qté</th>
                        <th className="border p-2 text-right">P.U.</th>
                        <th className="border p-2 text-right">Montant</th>
                    </tr>
                </thead>
                <tbody>
                    {print.products?.map((p, i) => {
                        const total = p.quantity * p.price;

                        return (
                            <tr key={i}>
                                <td className="border p-2">{p.product}</td>
                                <td className="border p-2 text-center">
                                    {format(p.quantity)}
                                </td>
                                <td className="border p-2 text-right">
                                    {format(p.price)}
                                </td>
                                <td className="border p-2 text-right">
                                    {format(total)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* TOTALS */}
            <div className="flex justify-end mb-6">
                <div className="w-1/3">
                    <div className="flex justify-between border-b py-1">
                        <span>Sous-total :</span>
                        <span>{format(print.priceHT)}</span>
                    </div>

                    <div className="flex justify-between border-b py-1">
                        <span>Remise :</span>
                        <span>-{format(print.remise)}</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg py-2">
                        <span>TOTAL TTC :</span>
                        <span>{format(print.priceTTC)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Payé :</span>
                        <span>{format(print.payment)}</span>
                    </div>

                    <div className="flex justify-between font-bold">
                        <span>Reste :</span>
                        <span>{format(print.rest)}</span>
                    </div>
                </div>
            </div>

            {/* MONTANT EN LETTRE */}
            <div className="mb-10">
                <p>
                    Arrêté la présente facture à la somme de :
                </p>
                <p className="font-bold mt-1">
                    {print.amountLetter}
                </p>
            </div>

            {/* SIGNATURE */}
            <div className="flex justify-between mt-16">
                <div>
                    <p className="font-bold">Signature Client</p>
                    <div className="h-16 border w-64 mt-2"></div>
                </div>

                <div>
                    <p className="font-bold">Cachet & Signature</p>
                    <div className="h-16 border w-64 mt-2"></div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="text-center mt-10 text-xs border-t pt-4">
                Merci pour votre confiance
            </div>

        </div>}
    </>
}