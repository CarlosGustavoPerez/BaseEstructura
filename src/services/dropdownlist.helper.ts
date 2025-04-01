import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { ICamposListaOpciones } from '../interfaces/ICamposListaOpciones';
class DropdownHelper {
  
public convertOpcionesToDropdown = (item: ICamposListaOpciones): IDropdownOption => {
  return {
    key: item.Title,
    text: item.Title
  };
}
  
}
export default new DropdownHelper();
