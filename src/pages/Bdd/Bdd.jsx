import { useSelector } from "react-redux";
import CardImport from "../../components/bdd/CardImport";
import Notification from "../../layout/Notification"


export default function BddPage() {

  const errorNotification = useSelector(state => state.note.error);
  const relaunch = useSelector(state => state.note.relaunch);
  const dataItem = useSelector(state => state.note.dataItem);


  return <>
    <div className="flex justify-center gap-2 flex-wrap">
      <CardImport title="Bénéficiaires" />
    </div>

    {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
  </>
}