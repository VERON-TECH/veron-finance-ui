import { useQuery } from "@tanstack/react-query";
import Table from "../../layout/Table"
import { project } from "../../data/menu";
import { memo, useEffect, useRef } from "react";
import Submit from "../../layout/Submit";
import Modal from "../../layout/Modal";
import Notification from "../../layout/Notification";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects } from "../../utils/http";
import CreateBeneficiary from "../../components/beneficiary/CreateBeneficiary";
import { identifierMenuActions } from "../../store/identifierSlice";
import CreateProject from "../../components/projet/CreateProject";
import { AnimatePresence } from "framer-motion";

const ProjectPage = memo(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  const errorNotification = useSelector(state => state.note.error);
  const relaunch = useSelector(state => state.note.relaunch);
  const dataItem = useSelector(state => state.note.dataItem)
  const dispatch = useDispatch()
  const menu = useSelector(state => state.identifier.menu)


  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
    enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_AGENT")
  })



  const dialog = useRef()

  function handleModal() {
    dialog.current.open();
  }

  useEffect(() => {
    dispatch(identifierMenuActions.updateMenu({ menu: "project" }))
  }, [menu, dispatch])


  return <>
    <div className="flex justify-center">
      {user.role.includes("ROLE_AGENT") && <Submit onClick={handleModal}>Nouveau</Submit>}
    </div>
    <Table data={data} headers={project.header} emptyMessage="Aucun segment trouvé." sheet="project" titleRef="Mise à jour informations d'un segment" size="lg:h-5/10 lg:w-7/15" />
    <AnimatePresence>
      <Modal ref={dialog} size="lg:h-5/11 lg:w-4/15" title="Créer un segment">
        <CreateProject />
      </Modal>
    </AnimatePresence>

    {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
  </>
})

export default ProjectPage;