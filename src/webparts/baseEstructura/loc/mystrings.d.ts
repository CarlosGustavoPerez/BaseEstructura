declare interface IBaseEstructuraWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'BaseEstructuraWebPartStrings' {
  const strings: IBaseEstructuraWebPartStrings;
  export = strings;
}
