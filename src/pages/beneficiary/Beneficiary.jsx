import { useQuery } from "@tanstack/react-query";
import Table from "../../layout/Table"
import { beneficiary } from "../../data/menu";
import { memo, useEffect, useRef } from "react";
import Submit from "../../layout/Submit";
import Modal from "../../layout/Modal";
import Notification from "../../layout/Notification";
import { useDispatch, useSelector } from "react-redux";
import { getAllBeneficiary } from "../../utils/http";
import CreateBeneficiary from "../../components/beneficiary/CreateBeneficiary";
import { identifierMenuActions } from "../../store/identifierSlice";

const BeneficiaryPage = memo(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  const errorNotification = useSelector(state => state.note.error);
  const relaunch = useSelector(state => state.note.relaunch);
  const dataItem = useSelector(state => state.note.dataItem)
  const dispatch = useDispatch()
  const menu = useSelector(state => state.identifier.menu)


  const { data } = useQuery({
    queryKey: ["beneficiaries"],
    queryFn: getAllBeneficiary,
    enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_AGENT")
  })



  const dialog = useRef()

  function handleModal() {
    dialog.current.open();
  }

  useEffect(() => {
    dispatch(identifierMenuActions.updateMenu({ menu: "beneficiary" }))
  }, [menu, dispatch])


  return <>
    <div className="flex justify-center">
      {user.role.includes("ROLE_AGENT") && <Submit onClick={handleModal}>Nouveau</Submit>}
    </div>
    <Table data={data} headers={beneficiary.header} emptyMessage="Aucun bénéficiaire trouvé." sheet="Beneficiary" titleRef="Mise à jour informations du bénéficiaire" size="lg:h-screen lg:w-8/15" />
    <Modal ref={dialog} size="lg:h-8/11 lg:w-8/15" title="Créer un bénéficiaire">
      <CreateBeneficiary />
    </Modal>
    {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
  </>
})

export default BeneficiaryPage;