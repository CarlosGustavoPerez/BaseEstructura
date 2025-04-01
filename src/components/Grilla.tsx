import * as React from 'react';
import { useState, useEffect } from 'react';
import SPODataProvider from '../config/SharePointDataProvider';
import { ICamposLista } from '../interfaces/IData';
import { IGrillaComponenteProps } from '../interfaces/IGrillaComponenteProps';
import {  PrimaryButton,
          DefaultButton,
          Panel,PanelType,
         } from '@fluentui/react';
import { ListView, IViewField, SelectionMode } from '@pnp/spfx-controls-react/lib/ListView';
import PanelFormulario from '../components/Formulario';

const GrillaComponente: React.FC<IGrillaComponenteProps> = (props) => {
  const [idFormulario, setIdFormulario] = useState(0);
  const [abrirPanel, setAbrirPanel] = useState(false);
  const [datos, setDatos] = useState<ICamposLista[]>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const camposSelectMonitoreos: string =[
    'ID',
    'Created',
    'Usuario/EMail', 
    'Usuario/Title', 
    'Combo'
  ].join(",");
  const camposExpandMonitoreos: string =[
    'Usuario', 
  ].join(",");
  useEffect(() => {
    cargarDatos();
  }, []);
  const cargarDatos = async () => {
    try {
      setCargando(true);
      const items = await SPODataProvider.getListItems<ICamposLista>(
        props.listName,
        camposSelectMonitoreos,
        "",  // Filtro 
        camposExpandMonitoreos,  // Expand 
        "ID", // Ordenar
        false
      );
      // Aplanar las propiedades anidadas
      const datosAplanados = items.map(item => ({
        ...item,
        'Usuario.Title': item.Usuario?.Title || '',
      }));
      setDatos(datosAplanados);
      console.group(datosAplanados);
    } catch (err) {
      setError(`Error cargando datos: ${err}`);
    } finally {
      setCargando(false);
    }
  };
  const abrirFormulario = async (item) => {
    setIdFormulario(item);   
    setAbrirPanel(true);
  };
  const recargarGrilla = async () => {
    setAbrirPanel(false);
    cargarDatos();
  };
  const callbackFunction = (childData: string) => {
    console.log("Callback data from child: ", childData);
    recargarGrilla();
  };
  // Configuración de las columnas para ListView
  const viewFields: IViewField[] = [
    {
      name: 'ID',
      displayName: 'ID',
      minWidth: 50,
      maxWidth: 100,
      isResizable: true,
    },
    {
      name: 'Created',
      displayName: 'Fecha de Creación',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      render: (item: any) => {
        const fechaHoraCreacion = new Date(item.Created);
        return `${fechaHoraCreacion.toLocaleDateString()} ${fechaHoraCreacion.toLocaleTimeString()}`;
      },
    },
    {
      name: 'Usuario.Title',
      displayName: 'Usuario',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      name: 'Combo',
      displayName: 'Combo',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      name: 'Abrir/Editar',
      displayName: 'Abrir/Editar',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      render: (item) => (
        <DefaultButton text="Editar" onClick={() => abrirFormulario(item.ID)} />
      ),
    },
    {
      name: "Eliminar",
      displayName: "Eliminar",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      render: (item: any) => (
        <PrimaryButton
          text="Eliminar"
          onClick={() => handleEliminar(item.ID)}
          styles={{
            root: {
              backgroundColor: "#d9534f",
              color: "white",
            },
          }}
        />
      ),
    },
  ];
  const handleEliminar = async (id: number) => {
    try {
      const confirmacion = window.confirm("¿Está seguro de que desea eliminar este registro?");
      if (confirmacion) {
        await SPODataProvider.delete(props.listName, id);
        console.log(`Registro con ID ${id} eliminado correctamente.`);
        cargarDatos(); 
      }
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      alert("Ocurrió un error al intentar eliminar el registro.");
    }
  };
    return (
      <>
        <Panel
          isOpen={abrirPanel}
          onDismiss={()=> recargarGrilla()}
          closeButtonAriaLabel="Close"
          type={PanelType.large}
        >
          <PanelFormulario
            parentCallback={callbackFunction}
            context={props.context}
            recargarGrilla={()=> recargarGrilla()}
            id={idFormulario}
            lista={props.listName}
            websiteAbsoluteUrl={props.context.pageContext.web.absoluteUrl}
          >
          </PanelFormulario>
        </Panel>
        <DefaultButton  onClick={() => abrirFormulario(0)} text="Nuevo" />
        {cargando && <div>Cargando...</div>}
      {error && <div>{error}</div>}
      {!cargando && datos && (
        <ListView
          items={datos}          
          showFilter={true}
          filterPlaceHolder="Buscar.."
          compact={true}
          selectionMode={SelectionMode.none}
          stickyHeader={true}
          viewFields={viewFields}
        />
      )}
    </>
  );
};
  
export default GrillaComponente;