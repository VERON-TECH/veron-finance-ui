import { useSelector } from "react-redux";
import { useState } from "react";
import Logo from "../../layout/LogoDark";

export default function PrintSuppliesPage() {
    const print = useSelector(state => state.print);
    const [date] = useState(new Date().toLocaleDateString());
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div
            className="bg-white mx-auto p-8 text-sm"
            style={{ width: "210mm", minHeight: "297mm" }}
        >
            {/* HEADER */}
            <div className="flex justify-between mb-6">
                <div>
                    <Logo />
                    <p className="font-bold mt-2">{print.enterprise.name}</p>
                    <p>Tel: {print.enterprise.phone} / {print.enterprise.phone2}</p>
                    <p>Email: {print.enterprise.email}</p>
                    <p>Agréement Nº: {print.enterprise.authorizationNumber}</p>
                </div>

                <div className="text-right">
                    <h1 className="text-xl font-bold uppercase">
                        Commande
                    </h1>
                    <p><strong>Date :</strong> {date}</p>
                    <p><strong>Émis par :</strong> {user.username}</p>
                </div>
            </div>

            {/* FOURNISSEUR */}
            <div className="border p-4 mb-6">
                <h2 className="font-bold mb-2">Agence</h2>
                <p>{print.agency}</p>
            </div>

            {/* TABLEAU PRODUITS */}
            <table className="w-full border-collapse border border-gray-400 mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Article</th>
                        <th className="border p-2">Qté</th>
                        <th className="border p-2">P.U.</th>
                        <th className="border p-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {print.products_ &&
                        print.products_.map((p) => (
                            <tr key={p.ref}>
                                <td className="border p-2">{p.name}</td>
                                <td className="border p-2 text-center">{Number(p.quantity).toLocaleString()}</td>
                                <td className="border p-2 text-right">{Number(p.price).toLocaleString()}</td>
                                <td className="border p-2 text-right">{Number(p.totalPrice).toLocaleString()}</td>
                            </tr>
                        ))}
                </tbody>
            </table>



            {/* SIGNATURES */}
            <div className="flex justify-between mt-16">
                <div>
                    <p className="font-bold">Signature Bénéficiaire</p>
                    <div className="h-16 border w-48 mt-2"></div>
                </div>

                <div>
                    <p className="font-bold">Signature Autorisée</p>
                    <div className="h-16 border w-48 mt-2"></div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-10 text-center text-xs border-t pt-4">
                <p>{print.enterprise.slogan}</p>
                <p className="font-bold mt-2">Merci pour votre confiance</p>
            </div>
        </div>
    );
}
