export const validaciones = {
    validarDatosForm: (formData: any) => {
      const errors: any = {};
      if (!formData.name) {
        errors.name = 'Nombre requerido';
      }
      if (!formData.apellido) {
        errors.apellido = 'Apellido requerido';
      }
      return errors;
    },
  };
  