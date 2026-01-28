import { useSelector } from "react-redux";
import FormAuth from "../../components/auth/FormAuth";
import Logo from "../../layout/Logo";
import Footer from "../../components/footer/Footer";
import Notification from "../../layout/Notification";

export default function AuthPage() {
  const relaunch = useSelector(state => state.note.relaunch);
  const dataItem = useSelector(state => state.note.dataItem);
  const error = useSelector(state => state.note.error)

  return <div className="w-screen h-screen bg-sky-950">
    <Logo />
    <FormAuth />
    <Notification key={relaunch} error={error} messages={dataItem} />
    <Footer />
  </div>
}