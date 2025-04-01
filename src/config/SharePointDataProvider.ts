import { sp } from "@pnp/sp/presets/all";
import { IBaseEstructuraProps } from '../webparts/baseEstructura/components/IBaseEstructuraProps'; //'../webparts/monitoreoAttTelefonica/components/IMonitoreoAttTelefonicaProps';
import { IAttachmentInfo } from "@pnp/sp/attachments";
import { IItemAddResult, PagedItemCollection, IItem } from "@pnp/sp/items";
import { ISiteUserInfo } from "@pnp/sp/site-users/types";
import { ISiteGroupInfo } from "@pnp/sp/site-groups/types";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export default class SPODataProvider {
    private static _context: IBaseEstructuraProps;
    private static _contextWebPartContext: WebPartContext;
    // Método para inicializar el contexto
    public static Init(props: IBaseEstructuraProps): void {
        this._context = props.context;
        sp.setup({ spfxContext: props.context });
    }

    public static async getListItems<T>(
        listTitle: string,
        select: string = "*", // Cambia "*" si necesitas especificar campos adicionales
        filter: string = "",
        expand: string = "", // Asegúrate de no tener espacios adicionales
        order: string = "",
        form: boolean
    ): Promise<T[]> {
        return sp.web.lists
            .getByTitle(listTitle)
            .items
            .select(select) // Selecciona los campos del operador y del team leader
            .filter(filter)
            .expand(expand) // Asegúrate de expandir correctamente
            .top(5000)
            .orderBy(order, form)();
    }
    
    public static async getItemOrderTop<T>(
        listTitle: string,
        select: string = "*",
        filter: string = "",
        expand: string = "",
        orderby: string = "",
        top: number
    ): Promise<T[]> {
        return sp.web.lists
            .getByTitle(listTitle)
            .items.select(select)
            .filter(filter)
            .expand(expand)
            .orderBy(orderby, false)
            .top(top)();
    }

    public static async getItemById<T>(
        listTitle: string,
        id: number,
        select: string = "*",
        expand: string = ""
    ): Promise<T> {
        return sp.web.lists
            .getByTitle(listTitle)
            .items.getById(id)
            .select(select)
            .expand(expand)();
    }

    public static async getPaged<T>(
        listTitle: string,
        top: number,
        select: string = "*",
        filter: string = "",
        expand: string = ""
    ): Promise<PagedItemCollection<T[]>> {
        return sp.web.lists
            .getByTitle(listTitle)
            .items.select(select)
            .top(top)
            .filter(filter)
            .expand(expand)
            .getPaged<T[]>();
    }

    public static async add<T extends Record<string, any>>(
        listTitle: string,
        item: T
    ): Promise<IItemAddResult> {
        return sp.web.lists
            .getByTitle(listTitle)
            .items.add(item);
    }

    public static async update<T extends Record<string, any>>(
        listTitle: string,
        itemId: number,
        item: T
    ): Promise<void> {
        await sp.web.lists
            .getByTitle(listTitle)
            .items.getById(itemId)
            .update(item);
    }

    public static async updateMultiple<T extends Record<string, any>>(
        listTitle: string,
        items: T[]
    ): Promise<void> {
        const list = sp.web.lists.getByTitle(listTitle);
        
        for (const item of items) {
            await list.items.getById(item.Id).update(item);
        }
    }

    public static async delete(
        listTitle: string,
        itemId: number
    ): Promise<void> {
        await sp.web.lists
            .getByTitle(listTitle)
            .items.getById(itemId)
            .delete();
    }

    public static async getAttachments(
        listTitle: string,
        id: number
    ): Promise<IAttachmentInfo[]> {
        const item: IItem = sp.web.lists
            .getByTitle(listTitle)
            .items.getById(id);
        return item.attachmentFiles();
    }

    public static async getCurrentUser(): Promise<ISiteUserInfo> {
        return sp.web.currentUser();
    }

    public static async getGroups(): Promise<ISiteGroupInfo[]> {
        return sp.web.currentUser.groups();
    }
    public static async addAttachment(
        listTitle: string,
        itemId: number,
        fileName: string,
        fileContent: Blob
    ): Promise<void> {
    await sp.web.lists
        .getByTitle(listTitle)
        .items.getById(itemId)
        .attachmentFiles.add(fileName, fileContent);
    }
    public static async uploadFile(
        file: File,
        path: string,
        fileExtension: string
    ): Promise<IItem> {
        const fileName = `${Date.now()}.${fileExtension}`; // Using timestamp instead of GUID
        let fileResponse;

        if (file.size <= 10485760) {
            fileResponse = await sp.web.getFolderByServerRelativePath(path)
                .files.addUsingPath(fileName, file, { Overwrite: true });
        } else {
            fileResponse = await sp.web.getFolderByServerRelativePath(path)
                .files.addChunked(fileName, file);
        }

        return fileResponse.file.getItem();
    }

    public static async updateFile<T extends Record<string, any>>(
        item: IItem,
        properties: T
    ): Promise<void> {
        await item.update(properties);
    }

    public static async downloadFile(fileRef: string): Promise<void> {
        const buffer: ArrayBuffer = await sp.web.getFileByServerRelativePath(fileRef).getBuffer();
        const blob = new Blob([buffer]);
        const downloadUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = "";
        document.body.appendChild(anchor);
        anchor.click();
        URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(anchor);
    }

    public static async CanCurrentUserViewMembership(groupId: number): Promise<boolean> {
        return this._contextWebPartContext.spHttpClient
            .get(`${this._contextWebPartContext.pageContext.web.absoluteUrl}/_api/web/sitegroups/getbyid(${groupId})/CanCurrentUserViewMembership`, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse): Promise<{ value: boolean }> => response.json())
            .then((data: { value: boolean }) => data.value);
    }

    public static async CanCurrentUserViewMembershipByName(groupName: string): Promise<boolean> {
        return this._contextWebPartContext.spHttpClient
            .get(`${this._contextWebPartContext.pageContext.web.absoluteUrl}/_api/web/sitegroups/getbyname('${groupName}')/CanCurrentUserViewMembership`, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse): Promise<{ value: boolean }> => response.json())
            .then((data: { value: boolean }) => data.value);
    }
}
