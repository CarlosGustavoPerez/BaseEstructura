import * as React from 'react';
import { useState, useEffect } from 'react';
import { IAbmTipoDocumentosProps } from './AbmTipoDocumentosProps';
import styles from './AbmTipoDocumentos.module.scss';
import { sp } from "@pnp/sp/presets/all";
import { Panel,PanelType,
    DefaultButton,
    FocusZone, FocusZoneDirection,
    IconButton, ActionButton,
    IIconProps,
    Persona, PersonaSize,
    Text,
    Icon,
    ITextFieldStyleProps, ITextFieldStyles, ILabelStyles, ILabelStyleProps } from '@fluentui/react';
import PanelFormulario from './FormAbmTipoDocumentos';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import { LivePersona } from "@pnp/spfx-controls-react/lib/LivePersona";

const GrillaAbmTipoDocumentos: React.FC<IAbmTipoDocumentosProps> = (props: IAbmTipoDocumentosProps) => {

    const [abrirPanel, setAbrirPanel] = useState(false);
    const [idFormulario, setIdFormulario] = useState(null);
    const [tipoDoc, setTipoDoc] = useState([]);

    const ActivateOrders: IIconProps = { iconName: 'ComplianceAudit' };
    
    const callbackFunction = (childData) => {
        setAbrirPanel(false); 
      };
    const recargarGrilla= () =>{
        setAbrirPanel(false);
        CargarTipoDoc(); 
      };
    const abrirFormulario = async (sId) =>{
        setIdFormulario(sId);
        setAbrirPanel(true);
      };
    useEffect(() => {
    CargarTipoDoc();
    }, []);
    const CargarTipoDoc = async () => {
        await sp.web.lists.getByTitle('ABMTipoDeDocumentos')
        .items.select("Id, Created,TipoDeDocumento,Author/FirstName,Author/LastName,Author/EMail")
        .expand('Author')
        .getAll()
        .then((items) => {
            // console.group(items);
            setTipoDoc(items);
        });
    };
    function formatDate(isoDate) {
        const date = new Date(isoDate);
      
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; 
      }
    const viewFields: IViewField[] = [
        {
            name: "Id",
            displayName: "Id",
            isResizable: true,
            sorting: true,
            minWidth: 0,
            maxWidth: 30
        },
        {
        name: "TipoDeDocumento",
        displayName: "Tipo",
        isResizable: true,
        sorting: true,
        minWidth: 0,
        maxWidth: 150
        },
        {
            name: "Created",
            displayName: "Fecha de creación",
            // linkPropertyName: "c",    
            isResizable: true,
            sorting: true,
            minWidth: 0,
            maxWidth: 150,
            render: (item) => {
                return formatDate(item.Created); 
              },
        },
        {
        name: "Author",
        displayName: "Creado Por",
        maxWidth: 220,
        render: (item: any) => {
            return (
                    <LivePersona upn={item['Author.EMail']} 
                    template={
                      <>
                        <Persona onRenderPrimaryText={() => (<label>{item['Author.FirstName']+' '+item['Author.LastName']}</label>)} size={PersonaSize.size24} showInitialsUntilImageLoads imageShouldStartVisible
                        imageUrl={`/_layouts/15/userphoto.aspx?username=${item['Author.EMail']}`} />
                      </>
                    }
                    serviceScope={props.context.serviceScope}
                  />
                );
            }
        },
        {
            name: "Id",
            displayName: "Ver",
            // linkPropertyName: "c",    
            isResizable: true,
            sorting: true,
            minWidth: 0,
            maxWidth: 50,
            render: (item: any) => {
            return <IconButton iconProps={ActivateOrders} onClick={() => { abrirFormulario(item.Id) }} title="Ver Más" ariaLabel="Ver Más" />;
            }
        },
    ];
    const addIcon: IIconProps = { iconName: 'Add' };
    return (
        <div>
            <div className={styles.headerGrilla}>
                <Text className={styles.tituloGrilla}>TIPOS DE DOCUMENTOS</Text>
                <div className={styles.botonContainer}>
                    <DefaultButton
                        iconProps={addIcon} 
                        onClick={() => abrirFormulario(0)} 
                        text="Nuevo" 
                        className={styles.botonNuevo}
                    />
                </div>
            </div>

            <FocusZone direction={FocusZoneDirection.vertical}>
                
                <ListView
                    items={tipoDoc}          
                    showFilter={true}
                    filterPlaceHolder="Buscar..."
                    compact={true}
                    selectionMode={SelectionMode.none}
                    stickyHeader={true}
                    viewFields={viewFields}
                />

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
                    >
                    </PanelFormulario>
                </Panel>
            </FocusZone>
        </div>
    );
}
export default GrillaAbmTipoDocumentos;