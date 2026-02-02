import { NavLink, Outlet } from "react-router-dom";

export default function HomeProductServicePage() {
    return <>
        <div className="mb-4">
            <ul className="bg-sky-950 flex gap-4 p-2 text-xs text-sky-50 rounded">
                <NavLink to="" className="w-32  p-1 hover:border-b-4 font-medium text-center cursor-pointer">Produits/Fournitures</NavLink>
                <NavLink to="service" className="w-32  p-1 hover:border-b-4 font-medium text-center cursor-pointer">Services</NavLink>
            </ul>
        </div>
        <div>
            <Outlet />
        </div>
    </>
}