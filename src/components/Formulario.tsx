import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from '../webparts/baseEstructura/components/BaseEstructura.module.scss';
import dropdownlisthelper from "../services/dropdownlist.helper";
import { ICamposListaOpciones } from '../interfaces/ICamposListaOpciones';
import { ICamposLista } from '../interfaces/IData';
import { validaciones } from '../common/validationUtils';
import SPODataProvider from '../config/SharePointDataProvider';
import userServices from "../services/user.services";
import { IFormularioMonitoreoProps} from '../interfaces/IFormularioMonitoreoProps';
import { 
        PrimaryButton, TextField,
        Stack, IStackTokens,
        Separator,
        Label,
        MessageBar, MessageBarType,
        Dropdown, IDropdownOption,
        Persona, PersonaSize 
    } from '@fluentui/react';
import { FilePicker, IFilePickerResult,FileTypeIcon, ImageSize } from '@pnp/spfx-controls-react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';

const FormularioMonitoreo: React.FC<IFormularioMonitoreoProps > = (props: IFormularioMonitoreoProps ) => {
  const stackTokensEstado: IStackTokens = { childrenGap: 10 };
  const stylesSeparador = {
    root: [{
      selectors: {
        '::before': {
          background: '#03787c',
        },
      }
    }]
  };
  var today = new Date();
  let fechaYhoraCarga = today.toLocaleDateString() + ' ' + today.toLocaleTimeString();
  const [usuarioEmail, setUsuarioEmail] = useState("");
  const [usuarioNombreCompleto, setUsuarioNombreCompleto] = useState("");
  const [fechaHoraCreacion, setFechaHoraCreacion] = useState("");
  const [Opciones, setOpciones] = useState<IDropdownOption[]>();
  const [ddOpciones, setDdOpciones] = useState<IDropdownOption>();
  const [mensajeError, setMensajeError] = useState('');
  const [selFiles, setSelFiles] = useState<any[]>([]);
  const [adjuntarArchivos, setAdjuntarArchivos] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState([]);
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState([]);
  const [perteneceGrupo, setPerteneceGrupo] = useState(false);
  const [titulo, setTitulo] = useState('');

  useEffect(() => {
    usuarioLogueado();
    CargarOpciones();
    if(props.id != 0)
      {
        CargarDatos(props.id);
      }
      else{
        CargarDatosPerfilUsuario();
        setFechaHoraCreacion(fechaYhoraCarga);
      }
  }, []);
  const usuarioLogueado = async () => {
    try {
      const groups = await SPODataProvider.getGroups(); // Obtén los grupos del usuario
      const perteneceGrupoConst= await userServices.belongsGroupTeamLeader(groups);
      setPerteneceGrupo(perteneceGrupoConst);

    } catch (error) {
      console.error("Error al obtener los datos del usuario o grupos:", error);
      setMensajeError('Ocurrió un error al obtener los datos del usuario o grupos:'+error+'.');
    }
  };
  
  const CargarOpciones = async () => {
    const itemsComboOpciones = await SPODataProvider.getListItems<ICamposListaOpciones>(
      "BaseEstructuraAux",
      "Title",
      "",  // Filtro 
      "",  // Expand 
      "Title", // Ordenar
      false
    );
    const mapOpciones: IDropdownOption[] = itemsComboOpciones.map((opciones) => {
      return dropdownlisthelper.convertOpcionesToDropdown(opciones);
    });  
    setOpciones(mapOpciones);
  };
  const CargarDatosPerfilUsuario = async () => {
    try {
      const user = await SPODataProvider.getCurrentUser();
      setUsuarioEmail(user.Email);
      setUsuarioNombreCompleto(user.Title);
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
      setMensajeError('Ocurrió un error al obtener los datos del usuario:'+error+'.');
    }
  };
  const camposBaseEstructura: string =[
    'Title',
    'Combo',
    'Usuario/Id',
    'Usuario/Title',
    'Author/EMail',
    'Author/Title',
    'Author/Id',
    'Created',

  ].join(",");

  const camposExpandBaseEstructura: string =[
    'Usuario', 
    'Author',
  ].join(",");
  
  const CargarDatos = async (sId: number) => {
    try {
      const item = await SPODataProvider.getItemById<ICamposLista>(
        props.lista,
        sId,
        camposBaseEstructura,
        camposExpandBaseEstructura
      );
      let FechaHoraCreacion = new Date(item.Created.toString());
      setTitulo(item.Title);
      setDdOpciones({ key: item.Combo, text: item.Combo });
      setUsuarioSeleccionado([item.Usuario.Title]);
      setUsuarioSeleccionadoId([item.Usuario.Id]);
      setFechaHoraCreacion(FechaHoraCreacion.toLocaleDateString()+" "+ FechaHoraCreacion.toLocaleTimeString());
      setUsuarioEmail(item.Author.EMail);
      setUsuarioNombreCompleto(item.Author.Title);
    const attachments = await SPODataProvider.getAttachments(props.lista, sId);
    const mappedFiles = attachments.map((file) => ({
      Name: file.FileName,
      Url: file.ServerRelativeUrl,
    }));
    setSelFiles(mappedFiles);
    } catch (error) {
      console.error("Error al cargar los datos del registro:", error);
      setMensajeError('Ocurrió un error al cargar los datos del registro:'+error+'.');
      
    }
  };
  
  const onChangeOpciones = async (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): Promise<void> => {
    try {
      setDdOpciones(item);
    } catch (error) {
      console.error("Error al cambiar la campaña:", error);
      setMensajeError('Ocurrió un error al cambiar la campaña:'+error+'.');
    }
  };
  const _UsuarioSeleccionadoChanged = (items: any[]) => {
    let userIds: number[] = [];
    items.forEach(user => {
      userIds.push(user.id); // Obtén el ID del usuario seleccionado
    });
    setUsuarioSeleccionadoId(userIds); // Guarda los IDs en el estado
  };
  
  const handleSave = async () => {
    try {
      const formData = {
        Title: titulo,
        Combo: ddOpciones?.text || "",
        UsuarioId: usuarioSeleccionadoId[0],
      };
      const errors = validaciones.validarDatosForm({
        titulo,
        ddOpciones,
        usuarioSeleccionadoId,
        adjuntarArchivos,
      });
  
      if (Object.keys(errors).length > 0) {
        // Construir el mensaje de error con los campos vacíos
        const camposFaltantes = Object.keys(errors)
          .map((campo) => {
            switch (campo) {
              case 'titulo':
                return 'Título';
              case 'ddOpciones':
                return 'Opción seleccionada';
              case 'usuarioSeleccionadoId':
                return 'Usuario seleccionado';
              case 'adjuntarArchivos':
                return 'Archivo adjunto';
              default:
                return campo;
            }
          })
          .join(', ');
  
        setMensajeError(`Por favor complete los siguientes campos: ${camposFaltantes}.`);
        return;
      }
      let itemId;
      if (props.id && props.id !== 0) {
        await SPODataProvider.update(props.lista, props.id, formData);
        console.log("Elemento actualizado correctamente");
        itemId = props.id;
      } else {
        const result = await SPODataProvider.add(props.lista, formData);
        console.log("Elemento creado correctamente");
        itemId = result.data.Id;
      }
      if (adjuntarArchivos.length > 0) {
        for (const file of adjuntarArchivos) {
          await SPODataProvider.addAttachment(props.lista, itemId, file.name, file);
          console.log(`Archivo ${file.name} adjuntado correctamente`);
        }
      }
      if (props.recargarGrilla) {
        props.recargarGrilla();
      }
      console.log("Formulario guardado y grilla recargada.");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setMensajeError("Ocurrió un error al guardar los datos. Por favor, inténtelo de nuevo.");
    }
  };
  const onFilePickerSave = async (filePickerResult: IFilePickerResult[]) => {
    if (filePickerResult && filePickerResult.length > 0) {
      let selfiles: any[] = [];
      let filesToUpload: any[] = [];
      for (let i = 0; i < filePickerResult.length; i++) {
        const item = filePickerResult[i];
        selfiles.push({
          Name: item.fileName,
        });
        const fileResultContent = await item.downloadFileContent();
        filesToUpload.push(fileResultContent);
      }
      setSelFiles(selfiles);
      setAdjuntarArchivos(filesToUpload);
    }
  };
  const textoACopiar = window.location+'?IdSolicitud=';
  const copiarAlPortapapeles = async (id)  => {
    const textArea = document.createElement('textarea');
    textArea.value = textoACopiar+id;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };
 
  return(
    <section className={styles.section}>
        <div className={styles.header}></div>
        <div className={styles.separator}></div>
        <div className={styles.DivForm}>
          
          <Stack tokens={stackTokensEstado} horizontal>
            <Stack.Item styles={{ root: { width: '50%' } }}>
              <Label>Título:</Label>
              <TextField
                placeholder="Ingrese el título"
                value={titulo}
                onChange={(e, newValue) => setTitulo(newValue || '')}
              />
            </Stack.Item>
            <Stack.Item styles={{ root: { width: '50%' } }}>
              <Label>Seleccione opcion: </Label>
              <Dropdown
                placeholder="Seleccione opcion"
                options={Opciones}
                selectedKey={ddOpciones ? ddOpciones.key : undefined}
                onChange={onChangeOpciones}
                className={styles.combos}
                styles={{ dropdown: { width: '100%' } }}
                disabled={!perteneceGrupo}
              />
            </Stack.Item>
          </Stack>
          <Stack tokens={stackTokensEstado} horizontal>
            <Stack.Item styles={{ root: { width: '50%' } }}>
              <Label>Fecha y hora de creacion: </Label>
              <Label>{fechaHoraCreacion}</Label>
            </Stack.Item>
            {perteneceGrupo && (
            <Stack.Item styles={{ root: { width: '50%' } }}>
              <Label>Realizado por:</Label>
              <Persona onRenderPrimaryText={() => (<h1>{usuarioNombreCompleto}</h1>)} size={PersonaSize.size32} showInitialsUntilImageLoads imageShouldStartVisible
                      imageUrl={`/_layouts/15/userphoto.aspx?username=${usuarioEmail}&size=${PersonaSize.size32}`} styles={{ primaryText: { color: '#03787c', fontSize: '10px', }, }} />
            </Stack.Item>
            )}
          </Stack>
          <Separator styles={stylesSeparador}></Separator>
          <Stack tokens={stackTokensEstado} horizontal>
            <Stack.Item styles={{ root: { width: '50%' } }}>
              <FilePicker
                accepts={[".pdf", ".docx", ".xlsx"]}
                buttonIcon={"FileTypeIcon}"}
                buttonLabel='Seleccione archivo(s)'
                onSave={onFilePickerSave}
                onChange={(filePickerResult: IFilePickerResult[]) => { console.log(filePickerResult); }}
                context={props.context as any}
                hideLocalMultipleUploadTab={false}
              />
              {selFiles.length > 0 && (
                <div className={styles.filePicker}>
                  <Label>Archivos seleccionados:</Label>
                  {selFiles.map((file, index) => (
                    <div key={index} className={styles.filePickerItem}>
                      <FileTypeIcon type={file.Name} size={ImageSize.medium} />
                      <a href={file.Url} target="_blank" rel="noopener noreferrer">
                        {file.Name}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </Stack.Item>
            <Stack.Item styles={{ root: { width: '50%' } }}>
              <Label>Seleccione usuario: </Label>
              <PeoplePicker
                placeholder='Seleccione usuario'
                personSelectionLimit={1}
                context={props.context}
                showtooltip={true}
                ensureUser={true}
                onChange={_UsuarioSeleccionadoChanged}
                principalTypes={[PrincipalType.User]}
                defaultSelectedUsers={usuarioSeleccionado}
                peoplePickerCntrlclassName={styles.peoplePickerdBackgroundColor}
                resolveDelay={1000} 
              />
            </Stack.Item>
          </Stack>
          <Separator styles={stylesSeparador}></Separator>
          <PrimaryButton 
            styles={{
                root: {
                width: '100%',
                },
            }}
            onClick={() =>handleSave()}
            >
                Guardar
          </PrimaryButton>
        {mensajeError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={true}
            onDismiss={() => setMensajeError('')}
          >
            {mensajeError}
          </MessageBar>
        )}
      </div>
    </section>
  );
};
  
export default FormularioMonitoreo;