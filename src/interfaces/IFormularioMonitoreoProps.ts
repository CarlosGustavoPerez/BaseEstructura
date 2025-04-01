export interface IFormularioMonitoreoProps {
  parentCallback: (childData: string) => void;
  context: any | null;
  recargarGrilla: () => void;
  id: number;
  lista: string;
  websiteAbsoluteUrl: string;
}