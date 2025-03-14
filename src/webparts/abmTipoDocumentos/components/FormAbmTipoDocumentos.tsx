import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './AbmTipoDocumentos.module.scss';
import {
    PrimaryButton,
    TextField,
    Dropdown, IDropdownOption,
    Stack,
    Label, Separator,
    ITextFieldStyleProps, ITextFieldStyles,
    Icon,
    MessageBar, MessageBarType,
    Toggle
  } from '@fluentui/react';
import { sp } from "@pnp/sp/presets/all";
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { isEmpty } from '@microsoft/sp-lodash-subset';

export interface IFormAbmTipoDocumentosProps {
    parentCallback: (childData: string) => void;
    context: any | null;
    recargarGrilla: () => void;
    id: string | null;
  }

const FormAbmTipoDocumentos: React.FC<IFormAbmTipoDocumentosProps> = (props: IFormAbmTipoDocumentosProps) => {
  const [ddTipoDoc, setDdTipoDoc] = useState<IDropdownOption>();
  const [ddTipoNotificacion, setDdTipoNotificacion] = useState<IDropdownOption>();
  const [ddCantidadAprob, setDdCantidadAprob] = useState<IDropdownOption>();
  const [prefijo, setPrefijo] = useState("");
  const [versionInicial, setVersionInicial] = useState("");
  const [biblioteca, setBiblioteca] = useState("");
  const [nombreDocumento, setNombreDocumento] = useState("");
  const [aprobadorTitular1, setAprobadorTitular1] = useState([]);
  const [aprobadorTitular2, setAprobadorTitular2] = useState([]);
  const [aprobadorTitular3, setAprobadorTitular3] = useState([]);
  const [aprobadorSuplente1, setAprobadorSuplente1] = useState([]);
  const [aprobadorSuplente2, setAprobadorSuplente2] = useState([]);
  const [aprobadorSuplente3, setAprobadorSuplente3] = useState([]);
  const [aprobadorTitular1Id, setAprobadorTitular1Id] = useState([]);
  const [aprobadorTitular2Id, setAprobadorTitular2Id] = useState([]);
  const [aprobadorTitular3Id, setAprobadorTitular3Id] = useState([]);
  const [aprobadorSuplente1Id, setAprobadorSuplente1Id] = useState([]);
  const [aprobadorSuplente2Id, setAprobadorSuplente2Id] = useState([]);
  const [aprobadorSuplente3Id, setAprobadorSuplente3Id] = useState([]);
  const [mostrarMessageBar, setMostrarMessageBar] = useState(false);
  const [showStacks, setShowStacks] = useState([false, false, false]);
  const [mensajeError, setMensajeError] = useState('');
  const [estadoActivo, setEstadoActivo] = useState(true);

  const _AprobadorTitular1Changed = (items: any[]) => {
    let userarr: string[] = [];
    items.forEach(user => {
      userarr.push( user.id );
    });
    setAprobadorTitular1Id(userarr);
  };
  const _AprobadorSuplente1Changed = (items: any[]) => {
    let userarr: string[] = [];
    items.forEach(user => {
      userarr.push( user.id );
    });
    setAprobadorSuplente1Id(userarr);
  };
  const _AprobadorTitular2Changed = (items: any[]) => {
    let userarr: string[] = [];
    items.forEach(user => {
      userarr.push( user.id );
    });
    setAprobadorTitular2Id(userarr);
  };
  const _AprobadorSuplente2Changed = (items: any[]) => {
    let userarr: string[] = [];
    items.forEach(user => {
      userarr.push( user.id );
    });
    setAprobadorSuplente2Id(userarr);
  };

  const _AprobadorTitular3Changed = (items: any[]) => {
    let userarr: string[] = [];
    items.forEach(user => {
      userarr.push( user.id );
    });
    setAprobadorTitular3Id(userarr);
  };
  const _AprobadorSuplente3Changed = (items: any[]) => {
    let userarr: string[] = [];
    items.forEach(user => {
      userarr.push( user.id );
    });
    setAprobadorSuplente3Id(userarr);
  };
  
  const cambiaTipoDoc = async (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): Promise<void> => {
    setDdTipoDoc(item);
  };
  const cambiaTipoNotificacion = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setDdTipoNotificacion(item);
  };
  const cambiaCantidadAprob = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setDdCantidadAprob(item);

    // Actualizar la visibilidad de los Stack según la opción seleccionada
    switch (item.key) {
      case "1":
        setShowStacks([true, false, false]);
        break;
      case "2":
        setShowStacks([true, true, false]);
        break;
      case "3":
        setShowStacks([true, true, true]);
        break;
      default:
        setShowStacks([false, false, false]);
    }
  };
  const TipoDoc = [ 
    { key: 'A', text: 'A' },
    { key: 'B', text: 'B' },
    { key: 'C', text: 'C' },
  ];
  const renderOption = (option) => {
    return (
      <>
        <Icon {...option.iconProps} styles={{ root: { marginRight: 10 } }} />  
        {option.text}
      </>
    );
  };
  const TipoNotificacion = [
    { 
      key: 'Email',
      text: 'Email',
      iconProps:  {
        iconName: 'Mail'
      }
    },
    {
     key: 'Teams',
     text: 'Microsoft Teams',
     iconProps: {
       iconName: 'TeamsLogo'  
     }
   },
   {
        key: 'EmailTeams',
        text: 'Email y Microsoft Teams',
        iconProps: {
          iconName: 'MessageFill'  
        }
      }  
  ];
  const CantidadAprob = [
    { 
      key: '1',
      text: '1',
    },
    {
     key: '2',
     text: '2',
   },
   {
    key: '3',
    text: '3',
  } 
  ];
  const EstadoOpciones = [
    { 
      key: 'ACTIVO',
      text: 'ACTIVO',
    },
    {
     key: 'NO ACTIVO',
     text: 'NO ACTIVO',
   }
  ];
  const _PrefijoCambia = (changedvalue) => {
    setPrefijo(changedvalue.target.value);
  };
  const _BibliotecaCambia = (changedvalue) => {
    setBiblioteca(changedvalue.target.value);
  };
  
  const _VersionInicialCambia = (changedvalue) => {
    setVersionInicial(changedvalue.target.value);
  };
  const _NombreDocumentoCambia = (event) => {
    setNombreDocumento(event.target.value);
    setMostrarMessageBar(false); // Ocultar el mensaje al cambiar el valor
  };
  const _validarNombreDocumento = async () => {
    if (nombreDocumento.trim() === "") return;

    const existe = await existeTipoDocumento(nombreDocumento);
    setMostrarMessageBar(existe);
  };
  const existeTipoDocumento = async (tipoDoc) => {
    const listaTipoDocumentos = sp.web.lists.getByTitle("ABMTipoDeDocumentos");
    const items = await listaTipoDocumentos.items
      .filter(`TipoDeDocumento eq '${tipoDoc}'`)
      .get();
    return items.length > 0;
  };
  const stylesSeparador = {
    root: [{
      selectors: {
        '::before': {
          background: 'black',
        },
      }
    }]
  };
  const validarCampos = () => {
    const camposFaltantes = [];
    if (!nombreDocumento) {
      camposFaltantes.push('Nombre de documento,');
    }
    if (!ddTipoNotificacion || !ddTipoNotificacion.key) {
      camposFaltantes.push('Tipo de notificación, ');
    }
    if (!ddCantidadAprob || !ddCantidadAprob.key) {
      camposFaltantes.push('Cantidad de aprobaciones, ');
    }
    else{

      switch (ddCantidadAprob.key) {
        case "1":
          if (isEmpty(aprobadorTitular1Id)) {
            camposFaltantes.push('Aprobador titular 1, ');
          }
          if (isEmpty(aprobadorSuplente1Id)) {
            camposFaltantes.push('Aprobador suplente 1, ');
          }
          break;
        case "2":
          if (isEmpty(aprobadorTitular2Id)) {
            camposFaltantes.push('Aprobador titular 2, ');
          }
          if (isEmpty(aprobadorSuplente2Id)) {
            camposFaltantes.push('Aprobador suplente 2, ');
          }
          break;
        case "3":
          if (isEmpty(aprobadorTitular3Id)) {
            camposFaltantes.push('Aprobador titular 3, ');
          }
          if (isEmpty(aprobadorSuplente3Id)) {
            camposFaltantes.push('Aprobador suplente 3, ');
          }
          break;
        default:
      }
    }
    const cantidadAprobaciones = parseInt(ddCantidadAprob?.key.toString(), 10);
    if (ddTipoDoc && (ddTipoDoc.key === 'B') && (isNaN(cantidadAprobaciones) || cantidadAprobaciones > 2)) {
      camposFaltantes.push('Cantidad de aprobaciones debe ser menor o igual a 2, ');
    }
    if (!prefijo) {
      camposFaltantes.push('Prefijo, ');
    }
    if (!versionInicial) {
      camposFaltantes.push('Versión inicial,');
    }
    if (!ddTipoDoc || !ddTipoDoc.key) {
      camposFaltantes.push('Tipo. ');
    }
    if (camposFaltantes.length > 0) {
      const mensajeError = `Por favor complete los siguientes campos:\n${camposFaltantes.join('\n')}`;
      setMensajeError(mensajeError);
      return;
    }
    const exito = guardarRegistro();
    if (exito) {
      setMensajeError('');
    }

  };
  const guardarRegistro = async () => {
    const list = sp.web.lists.getByTitle('ABMTipoDeDocumentos');
    const itemData = {
      Title: 'Tipo de documento',
      TipoDeDocumento: nombreDocumento,
      TipoDeNotificacion: ddTipoNotificacion == null ? '' : ddTipoNotificacion.key,
      CantidadDeAprobacion: ddCantidadAprob == null ? '' : ddCantidadAprob.key,
      AprobadorTitularNivel1Id: aprobadorTitular1Id[0],
      AprobadorSuplenteNivel1Id: aprobadorSuplente1Id[0],
      AprobadorTitularNivel2Id: aprobadorTitular2Id[0],
      AprobadorSuplenteNivel2Id: aprobadorSuplente2Id[0],
      AprobadorTitularNivel3Id: aprobadorTitular3Id[0],
      AprobadorSuplenteNivel3Id: aprobadorSuplente3Id[0],
      VersionInicial: versionInicial,
      BibliotecaDocumentoPublicado: biblioteca,
      Prefijo: prefijo,
      TipoDoc: ddTipoDoc == null ? '' : ddTipoDoc.text,
      Estado: estadoActivo ? 'ACTIVO' : 'NO ACTIVO',
    };
    
    if(props.id == '0')
      {
        await list.items.add(itemData);
      }
      else{
        await list.items.getById(parseInt(props.id)).update(itemData);
      }
      props.recargarGrilla();
  };
  const _onChangeEstado = (ev, checked) => {
    setEstadoActivo(checked);
  };
  
  useEffect(() => {
    if(props.id == "0")
    {
      //CargarDatosPerfilUsuario();
    }
    else
    {
      CargarDatos(props.id);  
    }
  }, []);

  const CargarDatos = async (sId) => {
    await sp.web.lists.getByTitle("ABMTipoDeDocumentos").items.
    filter('Id eq '+ sId.toString()).select("Id, Created,TipoDeDocumento,TipoDeNotificacion, Author/FirstName, Author/LastName, Author/EMail,Prefijo,CantidadDeAprobacion,VersionInicial, AprobadorTitularNivel1/EMail,AprobadorTitularNivel1/Id,AprobadorSuplenteNivel1/EMail,AprobadorSuplenteNivel1/Id, AprobadorTitularNivel2/Id, AprobadorTitularNivel2/EMail, AprobadorSuplenteNivel2/EMail, AprobadorSuplenteNivel2/Id, AprobadorTitularNivel3/EMail, AprobadorTitularNivel3/Id, AprobadorSuplenteNivel3/EMail, AprobadorSuplenteNivel3/Id, TipoDoc, BibliotecaDocumentoPublicado,Estado")
    .expand("Author,AprobadorTitularNivel1,AprobadorSuplenteNivel1,AprobadorTitularNivel2,AprobadorSuplenteNivel2,AprobadorTitularNivel3,AprobadorSuplenteNivel3")
    .getAll().then((items)=>{  
      items.map((item)=>{
        setPrefijo(item.Prefijo);
        setVersionInicial(item.VersionInicial);
        setNombreDocumento(item.TipoDeDocumento);
        setBiblioteca(item.BibliotecaDocumentoPublicado);
        setDdTipoDoc({
            key: item.TipoDoc,
            text: item.TipoDoc,
        });
        setDdTipoNotificacion({
          key: item.TipoDeNotificacion,
          text: item.TipoDeNotificacion,
        });
        setDdCantidadAprob({
          key: item.CantidadDeAprobacion,
          text: item.CantidadDeAprobacion,
        });
        setEstadoActivo(item.Estado === 'ACTIVO');
        switch (item.CantidadDeAprobacion) {
          case "1":
            setShowStacks([true, false, false]);
            setAprobadorTitular1([item.AprobadorTitularNivel1.EMail]);
            setAprobadorSuplente1([item.AprobadorSuplenteNivel1.EMail]);
            setAprobadorTitular1Id([item.AprobadorTitularNivel1.Id]);
            setAprobadorSuplente1Id([item.AprobadorSuplenteNivel1.Id]);
            break;
          case "2":
            setShowStacks([true, true, false]);
            setAprobadorTitular1([item.AprobadorTitularNivel1.EMail]);
            setAprobadorSuplente1([item.AprobadorSuplenteNivel1.EMail]);
            setAprobadorTitular2([item.AprobadorTitularNivel2.EMail]);
            setAprobadorSuplente2([item.AprobadorSuplenteNivel2.EMail]);
            setAprobadorTitular1Id([item.AprobadorTitularNivel1.Id]);
            setAprobadorSuplente1Id([item.AprobadorSuplenteNivel1.Id]);
            setAprobadorTitular2Id([item.AprobadorTitularNivel2.Id]);
            setAprobadorSuplente2Id([item.AprobadorSuplenteNivel2.Id]);
            break;
          case "3":
            setShowStacks([true, true, true]);
            setAprobadorTitular1([item.AprobadorTitularNivel1.EMail]);
            setAprobadorSuplente1([item.AprobadorSuplenteNivel1.EMail]);
            setAprobadorTitular2([item.AprobadorTitularNivel2.EMail]);
            setAprobadorSuplente2([item.AprobadorSuplenteNivel2.EMail]);
            setAprobadorTitular3([item.AprobadorTitularNivel3.EMail]);
            setAprobadorSuplente3([item.AprobadorSuplenteNivel3.EMail]);
            setAprobadorTitular1Id([item.AprobadorTitularNivel1.Id]);
            setAprobadorSuplente1Id([item.AprobadorSuplenteNivel1.Id]);
            setAprobadorTitular2Id([item.AprobadorTitularNivel2.Id]);
            setAprobadorSuplente2Id([item.AprobadorSuplenteNivel2.Id]);
            setAprobadorTitular3Id([item.AprobadorTitularNivel3.Id]);
            setAprobadorSuplente3Id([item.AprobadorSuplenteNivel3.Id]);
            break;
          default:
            setShowStacks([false, false, false]);
        }
      });
    });
  };
    return (
        <section>
            <div className={styles.header}></div>
            <div className={styles.separator}></div>
            <div className={styles.divForm}>
              <Stack>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                  <Stack verticalAlign="start" className={styles.customStack}>
                  <Label>Nombre de documento: </Label>
                    <TextField
                      placeholder='Nombre de Documento'
                      value={nombreDocumento}
                      onChange={_NombreDocumentoCambia}
                      styles={getStyles}
                      onBlur={_validarNombreDocumento}
                    />
                  </Stack>
                  <Stack verticalAlign="start" className={styles.customStack}>
                    <Label>Tipo de notificación: </Label>
                    <Dropdown
                      placeholder="Seleccione..."
                      options={TipoNotificacion}
                      onRenderOption={renderOption}  
                      selectedKey={ddTipoNotificacion ? ddTipoNotificacion.key : undefined}
                      onChange={cambiaTipoNotificacion}
                      className={styles.combos}
                      styles={{ dropdown: { width: '100%' } }}
                    />
                    </Stack>
                    <Stack verticalAlign="start" className={styles.customStackAprob}>
                    <Label>Cantidad Aprobaciones: </Label>
                    <Dropdown
                      placeholder="Seleccione..."
                      options={CantidadAprob}
                      selectedKey={ddCantidadAprob ? ddCantidadAprob.key : undefined}
                      onChange={cambiaCantidadAprob}
                      className={styles.combos}
                      styles={{ dropdown: { width: '100%' } }}
                    />
                  </Stack>
                  
                </Stack>
                {mostrarMessageBar && (
                    <>
                    <MessageBar messageBarType={MessageBarType.error}  isMultiline={false} >
                      Ya existe un registro con èste Nombre de Documento
                    </MessageBar>
                  </>
                  )}
                <Stack>
                  {showStacks[0] && (
                    <>
                      <Separator styles={stylesSeparador}></Separator>
                      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                        <Label>Seleccione aprobador titular: </Label>
                        
                        <PeoplePicker
                          placeholder='Ingrese aprobador'
                          personSelectionLimit={1}
                          context={props.context}
                          showtooltip={true}
                          ensureUser={true}
                          onChange={_AprobadorTitular1Changed}
                          principalTypes={[PrincipalType.User]}
                          defaultSelectedUsers={aprobadorTitular1}
                          peoplePickerCntrlclassName={styles.peoplePickerdBackgroundColor}
                          resolveDelay={1000} />
                        <Label>Seleccione aprobador suplente: </Label>
                        <PeoplePicker
                          placeholder='Ingrese aprobador'
                          personSelectionLimit={1}
                          context={props.context}
                          showtooltip={true}
                          ensureUser={true}
                          onChange={_AprobadorSuplente1Changed}
                          principalTypes={[PrincipalType.User]}
                          defaultSelectedUsers={aprobadorSuplente1}
                          peoplePickerCntrlclassName={styles.peoplePickerdBackgroundColor}
                          resolveDelay={1000} />
                      </Stack>
                      <Separator styles={stylesSeparador}></Separator>
                    </>
                  )}
                  {showStacks[1] && (
                    <>
                      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                        <Label>Seleccione aprobador titular: </Label>
                        <PeoplePicker
                          placeholder='Ingrese aprobador'
                          personSelectionLimit={1}
                          context={props.context}
                          showtooltip={true}
                          ensureUser={true}
                          onChange={_AprobadorTitular2Changed}
                          principalTypes={[PrincipalType.User]}
                          defaultSelectedUsers={aprobadorTitular2}
                          peoplePickerCntrlclassName={styles.peoplePickerdBackgroundColor}
                          resolveDelay={1000} />
                        <Label>Seleccione aprobador suplente: </Label>
                        <PeoplePicker
                          placeholder='Ingrese aprobador'
                          personSelectionLimit={1}
                          context={props.context}
                          showtooltip={true}
                          ensureUser={true}
                          onChange={_AprobadorSuplente2Changed}
                          principalTypes={[PrincipalType.User]}
                          defaultSelectedUsers={aprobadorSuplente2}
                          peoplePickerCntrlclassName={styles.peoplePickerdBackgroundColor}
                          resolveDelay={1000} />
                      </Stack>
                      <Separator styles={stylesSeparador}></Separator>
                    </>
                  )}
                  {showStacks[2] && (
                    <>
                      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                        <Label>Seleccione aprobador titular: </Label>
                        <PeoplePicker
                          placeholder='Ingrese aprobador'
                          personSelectionLimit={1}
                          context={props.context}
                          showtooltip={true}
                          ensureUser={true}
                          onChange={_AprobadorTitular3Changed}
                          principalTypes={[PrincipalType.User]}
                          defaultSelectedUsers={aprobadorTitular3}
                          peoplePickerCntrlclassName={styles.peoplePickerdBackgroundColor}
                          resolveDelay={1000} />
                        <Label>Seleccione aprobador suplente: </Label>
                        <PeoplePicker
                          placeholder='Ingrese aprobador'
                          personSelectionLimit={1}
                          context={props.context}
                          showtooltip={true}
                          ensureUser={true}
                          onChange={_AprobadorSuplente3Changed}
                          principalTypes={[PrincipalType.User]}
                          defaultSelectedUsers={aprobadorSuplente3}
                          peoplePickerCntrlclassName={styles.peoplePickerdBackgroundColor}
                          resolveDelay={1000} />
                      </Stack>
                      <Separator styles={stylesSeparador}></Separator>
                    </>
                  )}
                </Stack>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }} styles={{ root: { paddingTop: 10 } }}>
                  <Stack verticalAlign="start" className={styles.customStack}>
                    <Label>Prefijo: </Label>
                    <TextField
                      placeholder='Prefijo'
                      value={prefijo}
                      onChange={_PrefijoCambia}
                      styles={getStyles}
                    />
                  </Stack>
                  <Stack verticalAlign="start" className={styles.customStack}>
                    <Label>Versión inicial: </Label>
                    <TextField
                      placeholder='Versión inicial'
                      value={versionInicial}
                      onChange={_VersionInicialCambia}
                      styles={getStyles}
                    />
                  </Stack>
                  <Stack verticalAlign="start" className={styles.customStackAprob}>
                    <Label>Tipo de documento: </Label>
                    <Dropdown
                      placeholder="Seleccione..."
                      options={TipoDoc}
                      selectedKey={ddTipoDoc ? ddTipoDoc.key : undefined}
                      onChange={cambiaTipoDoc}
                      className={styles.combos}
                    />
                  </Stack>
                </Stack>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }} styles={{ root: { paddingTop: 10 } }}>
                  <Stack verticalAlign="start" className={styles.customStack}>
                    <Label>Biblioteca documento: </Label>
                    <TextField
                      placeholder='Biblioteca documento'
                      value={biblioteca}
                      onChange={_BibliotecaCambia}
                      styles={getStyles}
                    />
                  </Stack>
                  <Stack verticalAlign="start" className={styles.customStackAprob}>
                    <Toggle 
                    label="Estado: "
                    checked={estadoActivo}
                    onText="ACTIVO"
                    offText="NO ACTIVO"
                    onChange={_onChangeEstado}
                    />
                  </Stack>
                </Stack>
                <Stack styles={{ root: { paddingTop: 10 } }}>
                  <PrimaryButton 
                  styles={{
                    root: {
                      width: '100%',
                    },
                  }}
                  disabled={mostrarMessageBar}
                  onClick={() =>validarCampos()}
                  >
                    Guardar
                  </PrimaryButton>
                  {mensajeError && (
                    <MessageBar
                      messageBarType={MessageBarType.error}
                      isMultiline={true} // Cambié a true para que los mensajes puedan aparecer en varias líneas
                      onDismiss={() => setMensajeError('')} // Limpiar el mensaje cuando se descarte
                    >
                      {mensajeError}
                    </MessageBar>
                  )}
                </Stack>
              </Stack>
            </div>
        </section>
    );
};

export default FormAbmTipoDocumentos;
function getStyles(props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
  return {
    fieldGroup: [
      {
        borderColor: "#edebe9",
      },
    ],
  };
}