import { useQuery } from "@tanstack/react-query";
import Table from "../../layout/Table"
import { finances } from "../../data/menu";
import { memo, useEffect } from "react";
import Submit from "../../layout/Submit";
import Modal from "../../layout/Modal";
import Notification from "../../layout/Notification";
import { useDispatch, useSelector } from "react-redux";
import { getAllFinancements, } from "../../utils/http";
import { identifierMenuActions } from "../../store/identifierSlice";

const FinancePage = memo(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch()
  const menu = useSelector(state => state.identifier.menu)


  const { data } = useQuery({
    queryKey: ["finances"],
    queryFn: getAllFinancements,
    enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_AGENT")
  })




  useEffect(() => {
    dispatch(identifierMenuActions.updateMenu({ menu: "project" }))
  }, [menu, dispatch])


  return <>

    <Table data={data} headers={finances.header} emptyMessage="Aucun financement ou renforcement de capacité trouvé." sheet="finance" titleRef="Informations sur un financement" size="lg:h-6/13 lg:w-/15" />

  </>
})

export default FinancePage;