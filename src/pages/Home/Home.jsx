
import Header from "../../components/home/Header";
import Nav from "../../components/home/Nav";
import { subFeactures } from "../../data/menu";
import getToken from "../../utils/token";
import MenuBar from "../../components/home/MenuBar";
import Footer from "../../components/footer/Footer";
import { Outlet } from "react-router-dom";


export default function HomePage() {
  const token = getToken();


  return <>
    <Header />
    <Nav />
    <main className="absolute left-2/15 top-10 p-2  lg:w-13/15 lg:h-23/25">
      <MenuBar features={subFeactures} />
      {token ? <Outlet /> : <div className="text-sky-950 text-2xl text-shadow-2xl text-shadow-sky-950 font-bold">
        Bien vouloir vous reconnecter
      </div>}
    </main>
    <Footer font="bg-sky-950 text-sky-50" />
  </>
}