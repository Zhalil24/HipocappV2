export interface GetGroupsMemberRequest {
    id?:number;
    groupId: number;
    groupName?: string;
    userName?: string;
    userId: number;
    requestedOn: string;
    status: number;
}
