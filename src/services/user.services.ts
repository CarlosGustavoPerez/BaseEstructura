import SPODataProvider from '../config/SharePointDataProvider';
import { ISiteGroupInfo } from "@pnp/sp/site-groups/types";
import { RolEnum } from "../common/RolEnum";

class UserService {

  public belongsGroupTeamLeader= (groups: ISiteGroupInfo[]): boolean => {
    return groups.some(g=> g.LoginName === RolEnum.ROL_GRUPOPERMISOS);
  }
  public async getUserRol(): Promise<RolEnum> {
    const perteneceGrupo = await SPODataProvider.CanCurrentUserViewMembershipByName(RolEnum.ROL_GRUPOPERMISOS);
    if(perteneceGrupo) {
      return RolEnum.ROL_GRUPOPERMISOS;
    }
  }
}

export default new UserService();
