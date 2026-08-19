import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface ClickEvent_Key {
  id: UUIDString;
  __typename?: 'ClickEvent_Key';
}

export interface CreateFileData {
  file_insert: File_Key;
}

export interface CreateFileVariables {
  fileName: string;
  url: string;
  mime: string;
  size: Int64String;
}

export interface CreatePayoutData {
  payout_insert: Payout_Key;
}

export interface CreatePayoutVariables {
  amount: number;
  status: string;
}

export interface CreateShortLinkData {
  shortLink_insert: ShortLink_Key;
}

export interface CreateShortLinkVariables {
  slug: string;
  fileId: UUIDString;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  username: string;
  email: string;
  balance: number;
}

export interface DeleteClickEventData {
  clickEvent_delete?: ClickEvent_Key | null;
}

export interface DeleteClickEventVariables {
  id: UUIDString;
}

export interface DeleteFileData {
  file_delete?: File_Key | null;
}

export interface DeleteFileVariables {
  id: UUIDString;
}

export interface DeletePayoutData {
  payout_delete?: Payout_Key | null;
}

export interface DeletePayoutVariables {
  id: UUIDString;
}

export interface DeleteShortLinkData {
  shortLink_delete?: ShortLink_Key | null;
}

export interface DeleteShortLinkVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface File_Key {
  id: UUIDString;
  __typename?: 'File_Key';
}

export interface GetClickEventData {
  clickEvent?: {
    timestamp: TimestampString;
    countryCode?: string | null;
  };
}

export interface GetClickEventVariables {
  id: UUIDString;
}

export interface GetFileData {
  file?: {
    originalFileName: string;
    storageUrl: string;
  };
}

export interface GetFileVariables {
  id: UUIDString;
}

export interface GetPayoutData {
  payout?: {
    amount: number;
    status: string;
  };
}

export interface GetPayoutVariables {
  id: UUIDString;
}

export interface GetShortLinkData {
  shortLink?: {
    slug: string;
    expiresAt?: TimestampString | null;
  };
}

export interface GetShortLinkVariables {
  id: UUIDString;
}

export interface GetUserData {
  user?: {
    username: string;
    email: string;
    balance: number;
  };
}

export interface ListClickEventsData {
  clickEvents: ({
    shortLinkId: UUIDString;
    ipAddress: string;
  })[];
}

export interface ListMyFilesData {
  files: ({
    originalFileName: string;
    fileSize?: Int64String | null;
  })[];
}

export interface ListMyPayoutsData {
  payouts: ({
    amount: number;
    status: string;
  })[];
}

export interface ListMyShortLinksData {
  shortLinks: ({
    slug: string;
  })[];
}

export interface ListUsersData {
  users: ({
    username: string;
  })[];
}

export interface LogClickEventData {
  clickEvent_insert: ClickEvent_Key;
}

export interface LogClickEventVariables {
  shortLinkId: UUIDString;
  ip: string;
  country?: string | null;
}

export interface Payout_Key {
  id: UUIDString;
  __typename?: 'Payout_Key';
}

export interface ShortLink_Key {
  id: UUIDString;
  __typename?: 'ShortLink_Key';
}

export interface UpdateClickEventData {
  clickEvent_update?: ClickEvent_Key | null;
}

export interface UpdateClickEventVariables {
  id: UUIDString;
  country?: string | null;
}

export interface UpdateFileDescriptionData {
  file_update?: File_Key | null;
}

export interface UpdateFileDescriptionVariables {
  id: UUIDString;
  desc: string;
}

export interface UpdatePayoutStatusData {
  payout_update?: Payout_Key | null;
}

export interface UpdatePayoutStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateShortLinkExpiryData {
  shortLink_update?: ShortLink_Key | null;
}

export interface UpdateShortLinkExpiryVariables {
  id: UUIDString;
  expiresAt?: TimestampString | null;
}

export interface UpdateUserBalanceData {
  user_update?: User_Key | null;
}

export interface UpdateUserBalanceVariables {
  balance: number;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUserBalance' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserBalance(dc: DataConnect, vars: UpdateUserBalanceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserBalanceData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserBalance' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserBalance(vars: UpdateUserBalanceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserBalanceData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUser(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to execute without passing in DataConnect. */
export function getUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to pass in custom DataConnect instances. */
export function getUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to execute without passing in DataConnect. */
export function listUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;

/** Generated Node Admin SDK operation action function for the 'CreateFile' Mutation. Allow users to execute without passing in DataConnect. */
export function createFile(dc: DataConnect, vars: CreateFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateFileData>>;
/** Generated Node Admin SDK operation action function for the 'CreateFile' Mutation. Allow users to pass in custom DataConnect instances. */
export function createFile(vars: CreateFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateFileData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateFileDescription' Mutation. Allow users to execute without passing in DataConnect. */
export function updateFileDescription(dc: DataConnect, vars: UpdateFileDescriptionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateFileDescriptionData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateFileDescription' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateFileDescription(vars: UpdateFileDescriptionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateFileDescriptionData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteFile' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteFile(dc: DataConnect, vars: DeleteFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteFileData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteFile' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteFile(vars: DeleteFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteFileData>>;

/** Generated Node Admin SDK operation action function for the 'GetFile' Query. Allow users to execute without passing in DataConnect. */
export function getFile(dc: DataConnect, vars: GetFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetFileData>>;
/** Generated Node Admin SDK operation action function for the 'GetFile' Query. Allow users to pass in custom DataConnect instances. */
export function getFile(vars: GetFileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetFileData>>;

/** Generated Node Admin SDK operation action function for the 'ListMyFiles' Query. Allow users to execute without passing in DataConnect. */
export function listMyFiles(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyFilesData>>;
/** Generated Node Admin SDK operation action function for the 'ListMyFiles' Query. Allow users to pass in custom DataConnect instances. */
export function listMyFiles(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyFilesData>>;

/** Generated Node Admin SDK operation action function for the 'CreateShortLink' Mutation. Allow users to execute without passing in DataConnect. */
export function createShortLink(dc: DataConnect, vars: CreateShortLinkVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateShortLinkData>>;
/** Generated Node Admin SDK operation action function for the 'CreateShortLink' Mutation. Allow users to pass in custom DataConnect instances. */
export function createShortLink(vars: CreateShortLinkVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateShortLinkData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateShortLinkExpiry' Mutation. Allow users to execute without passing in DataConnect. */
export function updateShortLinkExpiry(dc: DataConnect, vars: UpdateShortLinkExpiryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateShortLinkExpiryData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateShortLinkExpiry' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateShortLinkExpiry(vars: UpdateShortLinkExpiryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateShortLinkExpiryData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteShortLink' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteShortLink(dc: DataConnect, vars: DeleteShortLinkVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteShortLinkData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteShortLink' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteShortLink(vars: DeleteShortLinkVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteShortLinkData>>;

/** Generated Node Admin SDK operation action function for the 'GetShortLink' Query. Allow users to execute without passing in DataConnect. */
export function getShortLink(dc: DataConnect, vars: GetShortLinkVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetShortLinkData>>;
/** Generated Node Admin SDK operation action function for the 'GetShortLink' Query. Allow users to pass in custom DataConnect instances. */
export function getShortLink(vars: GetShortLinkVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetShortLinkData>>;

/** Generated Node Admin SDK operation action function for the 'ListMyShortLinks' Query. Allow users to execute without passing in DataConnect. */
export function listMyShortLinks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyShortLinksData>>;
/** Generated Node Admin SDK operation action function for the 'ListMyShortLinks' Query. Allow users to pass in custom DataConnect instances. */
export function listMyShortLinks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyShortLinksData>>;

/** Generated Node Admin SDK operation action function for the 'LogClickEvent' Mutation. Allow users to execute without passing in DataConnect. */
export function logClickEvent(dc: DataConnect, vars: LogClickEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<LogClickEventData>>;
/** Generated Node Admin SDK operation action function for the 'LogClickEvent' Mutation. Allow users to pass in custom DataConnect instances. */
export function logClickEvent(vars: LogClickEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<LogClickEventData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteClickEvent' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteClickEvent(dc: DataConnect, vars: DeleteClickEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteClickEventData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteClickEvent' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteClickEvent(vars: DeleteClickEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteClickEventData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateClickEvent' Mutation. Allow users to execute without passing in DataConnect. */
export function updateClickEvent(dc: DataConnect, vars: UpdateClickEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateClickEventData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateClickEvent' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateClickEvent(vars: UpdateClickEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateClickEventData>>;

/** Generated Node Admin SDK operation action function for the 'GetClickEvent' Query. Allow users to execute without passing in DataConnect. */
export function getClickEvent(dc: DataConnect, vars: GetClickEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetClickEventData>>;
/** Generated Node Admin SDK operation action function for the 'GetClickEvent' Query. Allow users to pass in custom DataConnect instances. */
export function getClickEvent(vars: GetClickEventVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetClickEventData>>;

/** Generated Node Admin SDK operation action function for the 'ListClickEvents' Query. Allow users to execute without passing in DataConnect. */
export function listClickEvents(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListClickEventsData>>;
/** Generated Node Admin SDK operation action function for the 'ListClickEvents' Query. Allow users to pass in custom DataConnect instances. */
export function listClickEvents(options?: OperationOptions): Promise<ExecuteOperationResponse<ListClickEventsData>>;

/** Generated Node Admin SDK operation action function for the 'CreatePayout' Mutation. Allow users to execute without passing in DataConnect. */
export function createPayout(dc: DataConnect, vars: CreatePayoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePayoutData>>;
/** Generated Node Admin SDK operation action function for the 'CreatePayout' Mutation. Allow users to pass in custom DataConnect instances. */
export function createPayout(vars: CreatePayoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePayoutData>>;

/** Generated Node Admin SDK operation action function for the 'UpdatePayoutStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updatePayoutStatus(dc: DataConnect, vars: UpdatePayoutStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePayoutStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdatePayoutStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updatePayoutStatus(vars: UpdatePayoutStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePayoutStatusData>>;

/** Generated Node Admin SDK operation action function for the 'DeletePayout' Mutation. Allow users to execute without passing in DataConnect. */
export function deletePayout(dc: DataConnect, vars: DeletePayoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePayoutData>>;
/** Generated Node Admin SDK operation action function for the 'DeletePayout' Mutation. Allow users to pass in custom DataConnect instances. */
export function deletePayout(vars: DeletePayoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePayoutData>>;

/** Generated Node Admin SDK operation action function for the 'GetPayout' Query. Allow users to execute without passing in DataConnect. */
export function getPayout(dc: DataConnect, vars: GetPayoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPayoutData>>;
/** Generated Node Admin SDK operation action function for the 'GetPayout' Query. Allow users to pass in custom DataConnect instances. */
export function getPayout(vars: GetPayoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPayoutData>>;

/** Generated Node Admin SDK operation action function for the 'ListMyPayouts' Query. Allow users to execute without passing in DataConnect. */
export function listMyPayouts(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyPayoutsData>>;
/** Generated Node Admin SDK operation action function for the 'ListMyPayouts' Query. Allow users to pass in custom DataConnect instances. */
export function listMyPayouts(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyPayoutsData>>;

