import * as React from 'react';
import { IBaseEstructuraProps } from './IBaseEstructuraProps';
import GrillaComponente from '../../../components/Grilla';

// export default class BaseEstructura extends React.Component<IBaseEstructuraProps, {}> {
//   public render(): React.ReactElement<IBaseEstructuraProps> {
    
//     return (
//       <section>
//         {/* <GrillaBaseEstructura context={this.props.context}/> */}
//         <GrillaComponente 
//           siteUrl={siteUrl} 
//           listName={listaNombre.listaMonitoreoCalidad} 
//           context={props.context}
//         />
//       </section>
//     );
//   }
// }

const BaseEstructura: React.FC<IBaseEstructuraProps> = (props) => {
  
  const { siteUrl, listaNombre } = props;

  return (
    <GrillaComponente 
      siteUrl={siteUrl} 
      listName={listaNombre.listaBaseEstructura} 
      context={props.context}
    />
  );
};

export default BaseEstructura;
