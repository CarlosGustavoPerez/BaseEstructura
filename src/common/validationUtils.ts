export const validaciones = {
  validarDatosForm: (formData: any) => {
    const errors: any = {};
    if (!formData.titulo) {
      errors.titulo = 'El título es requerido.';
    }
    if (!formData.ddOpciones) {
      errors.ddOpciones = 'Debe seleccionar una opción.';
    }
    if (!formData.usuarioSeleccionadoId || formData.usuarioSeleccionadoId.length === 0) {
      errors.usuarioSeleccionadoId = 'Debe seleccionar un usuario.';
    }
    if (!formData.adjuntarArchivos || formData.adjuntarArchivos.length === 0) {
      errors.adjuntarArchivos = 'Debe adjuntar al menos un archivo.';
    }
    return errors;
  },
};
  