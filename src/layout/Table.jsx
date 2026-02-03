
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-blue/theme.css"
import { useMemo, useRef } from 'react';
import { Tooltip } from 'primereact/tooltip';
import 'primeicons/primeicons.css';
import { AnimatePresence, motion } from 'framer-motion';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { modalActions } from '../store/modalSlice';
import UpdateEnterprise from '../components/enterprise/UpdateEnteprise';
import UpdateAgency from '../components/agency/UpdateAgency';
import UpdateSafe from '../components/safe/UpdateSafe';
import UpdateCash from '../components/cash/UpdateCash';
import UpdateBankAccount from '../components/bankAccount/UpdateBankAccount';
import UpdateBank from '../components/bankAccount/UpdateBank';
import UpdateMobileMoney from '../components/mobile_money/UpdateMobileMoney';
import UpdateOperator from '../components/mobile_money/UpdateOperator';
import UpdateStorePrincipal from '../components/storePrincipal/UpdateStorePrincipal';
import ConfirmationDelete from '../components/global/ConfirmationDelete';
import UpdateTitle from '../components/personal/UpdateTitle';
import UpdatePersonal from '../components/personal/UpdatePersonal';
import UpdateUser from '../components/user/UpdateUser';
import UpdateCategory from '../components/service/UpdateCategory';
import UpdateService from '../components/service/UpdateService';
import UpdateProduct from '../components/product/UpdateProduct';





export default function Table({ data, headers, emptyMessage, sheet, titleRef, size }) {



  const dt = useRef(null);
  const exportColumns = headers.map((col) => ({ title: col.header, dataKey: col.field }));
  const dialog1 = useRef();
  const dispatch = useDispatch()
  const deletestate = useSelector(state => state.stateTable.delete)

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, sheet);
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data = new Blob([buffer], {
      type: EXCEL_TYPE
    });

    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  };

  function handleClick(value) {
    dispatch(modalActions.updateValue(value))
    dialog1.current.open();
  }


  const icons = useMemo(() => {
    return [{
      header: "Action",
      title: titleRef,
      field: data && data?.map(d => d?.id) || [] // Préparer les IDs sans muter un objet
    }];
  }, [data]);



  return <div className="card">

    <Tooltip target=".export-buttons>button" position="bottom" />
    <DataTable ref={dt}
      value={data}
      resizableColumns
      scrollHeight="400px"
      columnResizeMode="expand"
      filterDisplay="row"
      emptyMessage={emptyMessage}
      size="small"
      stripedRows
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      tableStyle={{ minWidth: '50rem', fontSize: '0.70em' }}
      pt={{
        root: { className: 'bg-sky-950 text-white' },
        header: { className: 'bg-sky-900 text-white' },
        bodyRow: { className: 'hover:bg-sky-800 text-white' },
        paginator: { className: 'bg-sky-900 text-white' }
      }}
    >

      {headers.map(header => (
        <Column key={header.key} field={header.field} header={header.header} sortable></Column>
      ))}

      {icons[0].field.length > 0 && icons[0].title === titleRef &&
        icons.map(icon => (
          <Column
            key={icon.header}
            field={icon.field}
            header={icon.header}
            sortable
            body={(rowData) => (
              <button onClick={() => handleClick(rowData.id)}>
                {deletestate === true ? <FontAwesomeIcon icon={faTrash} /> : <FontAwesomeIcon icon={faFolderOpen} />}
              </button>
            )}
          />))}

    </DataTable>
    <div className="flex items-center justify-end gap-2">
      <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
      <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
    </div>

    <AnimatePresence>
      <Modal ref={dialog1} title={titleRef} size={size}>
        {titleRef === "Mise à jour informations de l'entreprise" &&
          <UpdateEnterprise />
        }
        {titleRef === "Mise à jour informations de l'agence" &&
          <UpdateAgency />
        }

        {titleRef === "Mise à jour informations du coffre-fort" &&
          <UpdateSafe />
        }

        {titleRef === "Mise à jour informations de la caisse" &&
          <UpdateCash />
        }

        {titleRef === "Mise à jour informations d'un compte bancaire" &&
          <UpdateBankAccount />
        }

        {titleRef === "Mise à jour informations d'une banque" &&
          <UpdateBank />
        }

        {titleRef === "Mise à jour informations d'un compte mobile money" &&
          <UpdateMobileMoney />
        }

        {titleRef === "Mise à jour informations d'un opérateur" &&
          <UpdateOperator />
        }

        {titleRef === "Mise à jour informations d'un magasin principal" &&
          <UpdateStorePrincipal />
        }

        {titleRef === "Supprimer l'autorisation dans un compte bancaire" &&
          <ConfirmationDelete authorize={"bank"} />
        }

        {titleRef === "Supprimer l'autorisation dans un compte mobile money" &&
          <ConfirmationDelete authorize={"mobile"} />
        }

        {titleRef === "Supprimer l'autorisation dans un coffre-fort" &&
          <ConfirmationDelete authorize={"safe"} />
        }

        {titleRef === "Supprimer l'autorisation dans un magasin principal" &&
          <ConfirmationDelete authorize={"storePrincipal"} />
        }

        {titleRef === "Mise à jour informations d'une fonction" &&
          <UpdateTitle />
        }

        {titleRef === "Mise à jour informations d'un employé" &&
          <UpdatePersonal />
        }

        {titleRef === "Mise à jour informations d'un utilisateur" &&
          <UpdateUser />
        }

        {titleRef === "Mise à jour informations d'une catégorie de service" &&
          <UpdateCategory />
        }

        {titleRef === "Mise à jour informations d'un service" &&
          <UpdateService />
        }

        {titleRef === "Mise à jour informations d'un produit" &&
          <UpdateProduct />
        }





      </Modal>
    </AnimatePresence>
  </div>
}