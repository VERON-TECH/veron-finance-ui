import { useSelector } from "react-redux";
import Logo from "../../layout/LogoDark";


export default function PrintSalePage() {
    const print = useSelector(state => state.print);

    return (
        <div className="text-base bg-white absolute left-1/2 transform -translate-x-1/2 flex flex-col border-b-4 mt-4 p-2 rounded shadow-lg shadow-sky-50" style={{ width: '210mm', height: '200mm' }}>
            <Logo position="absolute top-5 left-1/2 transform -translate-x-1/2 mb-24" />
            <div className="absolute top-40 w-full">
                <p className="center bold">{print.enterprise?.name}</p>
                <p className="center">{print.enterprise?.phone}</p>
                <hr />

                <p>Doit : {print.customer}</p>
                <p>Agence : {print.agency}</p>
                <p>Facture N° : {print.ref}</p>
                <p>Date : {print.date} à {print.time}</p>

                <hr />

                <table className="w-full">
                    <thead>
                        <tr>
                            <th>DESIGNATION</th>
                            <th>QTE</th>
                            <th>PU</th>
                            <th>MT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {print.products?.map((p, i) => (
                            <tr key={i}>
                                <td className="text-center">{p.product}</td>
                                <td className="text-center">{p.quantity.toLocaleString()}</td>
                                <td className="text-center">{p.price.toLocaleString()}</td>
                                <td className="text-center">{(p.price * p.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <hr />

                <p>Total HT : {print.priceHT.toLocaleString()}</p>
                <p>Remise : {print.remise.toLocaleString()}</p>
                <p>Total TTC : {print.priceTTC.toLocaleString()}</p>
                <p>Acompte : {print.payment.toLocaleString()}</p>
                <p>Reste à payer : {print.rest.toLocaleString()}</p>

                <hr />

                <p>
                    Arrêté la présente facture à la somme de :
                    {print.payment.toLocaleString()} ({print.amountLetter})
                </p>

                <p className="center bold">{print.cash}</p>

                <br />
                <p className="center">Merci pour votre confiance</p>

            </div>

        </div>
    );
}
