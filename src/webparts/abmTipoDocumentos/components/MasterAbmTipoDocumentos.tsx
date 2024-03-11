import * as React from 'react';
import { IAbmTipoDocumentosProps } from './AbmTipoDocumentosProps';
import GrillaAbmTipoDocumentos from './GrillaAbmTipoDocumentos';

export default class AbmTipoDocumentos extends React.Component<IAbmTipoDocumentosProps, {}> {
  public render(): React.ReactElement<IAbmTipoDocumentosProps> {
    
    return (
      <section>
        <GrillaAbmTipoDocumentos context={this.props.context}/>
      </section>
    );
  }
}
