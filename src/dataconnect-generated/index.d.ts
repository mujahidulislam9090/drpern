import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

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

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserBalanceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserBalanceVariables): MutationRef<UpdateUserBalanceData, UpdateUserBalanceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserBalanceVariables): MutationRef<UpdateUserBalanceData, UpdateUserBalanceVariables>;
  operationName: string;
}
export const updateUserBalanceRef: UpdateUserBalanceRef;

export function updateUserBalance(vars: UpdateUserBalanceVariables): MutationPromise<UpdateUserBalanceData, UpdateUserBalanceVariables>;
export function updateUserBalance(dc: DataConnect, vars: UpdateUserBalanceVariables): MutationPromise<UpdateUserBalanceData, UpdateUserBalanceVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateFileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFileVariables): MutationRef<CreateFileData, CreateFileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFileVariables): MutationRef<CreateFileData, CreateFileVariables>;
  operationName: string;
}
export const createFileRef: CreateFileRef;

export function createFile(vars: CreateFileVariables): MutationPromise<CreateFileData, CreateFileVariables>;
export function createFile(dc: DataConnect, vars: CreateFileVariables): MutationPromise<CreateFileData, CreateFileVariables>;

interface UpdateFileDescriptionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFileDescriptionVariables): MutationRef<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateFileDescriptionVariables): MutationRef<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;
  operationName: string;
}
export const updateFileDescriptionRef: UpdateFileDescriptionRef;

export function updateFileDescription(vars: UpdateFileDescriptionVariables): MutationPromise<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;
export function updateFileDescription(dc: DataConnect, vars: UpdateFileDescriptionVariables): MutationPromise<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;

interface DeleteFileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFileVariables): MutationRef<DeleteFileData, DeleteFileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteFileVariables): MutationRef<DeleteFileData, DeleteFileVariables>;
  operationName: string;
}
export const deleteFileRef: DeleteFileRef;

export function deleteFile(vars: DeleteFileVariables): MutationPromise<DeleteFileData, DeleteFileVariables>;
export function deleteFile(dc: DataConnect, vars: DeleteFileVariables): MutationPromise<DeleteFileData, DeleteFileVariables>;

interface GetFileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFileVariables): QueryRef<GetFileData, GetFileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetFileVariables): QueryRef<GetFileData, GetFileVariables>;
  operationName: string;
}
export const getFileRef: GetFileRef;

export function getFile(vars: GetFileVariables, options?: ExecuteQueryOptions): QueryPromise<GetFileData, GetFileVariables>;
export function getFile(dc: DataConnect, vars: GetFileVariables, options?: ExecuteQueryOptions): QueryPromise<GetFileData, GetFileVariables>;

interface ListMyFilesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyFilesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyFilesData, undefined>;
  operationName: string;
}
export const listMyFilesRef: ListMyFilesRef;

export function listMyFiles(options?: ExecuteQueryOptions): QueryPromise<ListMyFilesData, undefined>;
export function listMyFiles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyFilesData, undefined>;

interface CreateShortLinkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateShortLinkVariables): MutationRef<CreateShortLinkData, CreateShortLinkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateShortLinkVariables): MutationRef<CreateShortLinkData, CreateShortLinkVariables>;
  operationName: string;
}
export const createShortLinkRef: CreateShortLinkRef;

export function createShortLink(vars: CreateShortLinkVariables): MutationPromise<CreateShortLinkData, CreateShortLinkVariables>;
export function createShortLink(dc: DataConnect, vars: CreateShortLinkVariables): MutationPromise<CreateShortLinkData, CreateShortLinkVariables>;

interface UpdateShortLinkExpiryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateShortLinkExpiryVariables): MutationRef<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateShortLinkExpiryVariables): MutationRef<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;
  operationName: string;
}
export const updateShortLinkExpiryRef: UpdateShortLinkExpiryRef;

export function updateShortLinkExpiry(vars: UpdateShortLinkExpiryVariables): MutationPromise<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;
export function updateShortLinkExpiry(dc: DataConnect, vars: UpdateShortLinkExpiryVariables): MutationPromise<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;

interface DeleteShortLinkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteShortLinkVariables): MutationRef<DeleteShortLinkData, DeleteShortLinkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteShortLinkVariables): MutationRef<DeleteShortLinkData, DeleteShortLinkVariables>;
  operationName: string;
}
export const deleteShortLinkRef: DeleteShortLinkRef;

export function deleteShortLink(vars: DeleteShortLinkVariables): MutationPromise<DeleteShortLinkData, DeleteShortLinkVariables>;
export function deleteShortLink(dc: DataConnect, vars: DeleteShortLinkVariables): MutationPromise<DeleteShortLinkData, DeleteShortLinkVariables>;

interface GetShortLinkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetShortLinkVariables): QueryRef<GetShortLinkData, GetShortLinkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetShortLinkVariables): QueryRef<GetShortLinkData, GetShortLinkVariables>;
  operationName: string;
}
export const getShortLinkRef: GetShortLinkRef;

export function getShortLink(vars: GetShortLinkVariables, options?: ExecuteQueryOptions): QueryPromise<GetShortLinkData, GetShortLinkVariables>;
export function getShortLink(dc: DataConnect, vars: GetShortLinkVariables, options?: ExecuteQueryOptions): QueryPromise<GetShortLinkData, GetShortLinkVariables>;

interface ListMyShortLinksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyShortLinksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyShortLinksData, undefined>;
  operationName: string;
}
export const listMyShortLinksRef: ListMyShortLinksRef;

export function listMyShortLinks(options?: ExecuteQueryOptions): QueryPromise<ListMyShortLinksData, undefined>;
export function listMyShortLinks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyShortLinksData, undefined>;

interface LogClickEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogClickEventVariables): MutationRef<LogClickEventData, LogClickEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogClickEventVariables): MutationRef<LogClickEventData, LogClickEventVariables>;
  operationName: string;
}
export const logClickEventRef: LogClickEventRef;

export function logClickEvent(vars: LogClickEventVariables): MutationPromise<LogClickEventData, LogClickEventVariables>;
export function logClickEvent(dc: DataConnect, vars: LogClickEventVariables): MutationPromise<LogClickEventData, LogClickEventVariables>;

interface DeleteClickEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteClickEventVariables): MutationRef<DeleteClickEventData, DeleteClickEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteClickEventVariables): MutationRef<DeleteClickEventData, DeleteClickEventVariables>;
  operationName: string;
}
export const deleteClickEventRef: DeleteClickEventRef;

export function deleteClickEvent(vars: DeleteClickEventVariables): MutationPromise<DeleteClickEventData, DeleteClickEventVariables>;
export function deleteClickEvent(dc: DataConnect, vars: DeleteClickEventVariables): MutationPromise<DeleteClickEventData, DeleteClickEventVariables>;

interface UpdateClickEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClickEventVariables): MutationRef<UpdateClickEventData, UpdateClickEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClickEventVariables): MutationRef<UpdateClickEventData, UpdateClickEventVariables>;
  operationName: string;
}
export const updateClickEventRef: UpdateClickEventRef;

export function updateClickEvent(vars: UpdateClickEventVariables): MutationPromise<UpdateClickEventData, UpdateClickEventVariables>;
export function updateClickEvent(dc: DataConnect, vars: UpdateClickEventVariables): MutationPromise<UpdateClickEventData, UpdateClickEventVariables>;

interface GetClickEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClickEventVariables): QueryRef<GetClickEventData, GetClickEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClickEventVariables): QueryRef<GetClickEventData, GetClickEventVariables>;
  operationName: string;
}
export const getClickEventRef: GetClickEventRef;

export function getClickEvent(vars: GetClickEventVariables, options?: ExecuteQueryOptions): QueryPromise<GetClickEventData, GetClickEventVariables>;
export function getClickEvent(dc: DataConnect, vars: GetClickEventVariables, options?: ExecuteQueryOptions): QueryPromise<GetClickEventData, GetClickEventVariables>;

interface ListClickEventsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListClickEventsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListClickEventsData, undefined>;
  operationName: string;
}
export const listClickEventsRef: ListClickEventsRef;

export function listClickEvents(options?: ExecuteQueryOptions): QueryPromise<ListClickEventsData, undefined>;
export function listClickEvents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListClickEventsData, undefined>;

interface CreatePayoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePayoutVariables): MutationRef<CreatePayoutData, CreatePayoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePayoutVariables): MutationRef<CreatePayoutData, CreatePayoutVariables>;
  operationName: string;
}
export const createPayoutRef: CreatePayoutRef;

export function createPayout(vars: CreatePayoutVariables): MutationPromise<CreatePayoutData, CreatePayoutVariables>;
export function createPayout(dc: DataConnect, vars: CreatePayoutVariables): MutationPromise<CreatePayoutData, CreatePayoutVariables>;

interface UpdatePayoutStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePayoutStatusVariables): MutationRef<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePayoutStatusVariables): MutationRef<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;
  operationName: string;
}
export const updatePayoutStatusRef: UpdatePayoutStatusRef;

export function updatePayoutStatus(vars: UpdatePayoutStatusVariables): MutationPromise<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;
export function updatePayoutStatus(dc: DataConnect, vars: UpdatePayoutStatusVariables): MutationPromise<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;

interface DeletePayoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePayoutVariables): MutationRef<DeletePayoutData, DeletePayoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePayoutVariables): MutationRef<DeletePayoutData, DeletePayoutVariables>;
  operationName: string;
}
export const deletePayoutRef: DeletePayoutRef;

export function deletePayout(vars: DeletePayoutVariables): MutationPromise<DeletePayoutData, DeletePayoutVariables>;
export function deletePayout(dc: DataConnect, vars: DeletePayoutVariables): MutationPromise<DeletePayoutData, DeletePayoutVariables>;

interface GetPayoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPayoutVariables): QueryRef<GetPayoutData, GetPayoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPayoutVariables): QueryRef<GetPayoutData, GetPayoutVariables>;
  operationName: string;
}
export const getPayoutRef: GetPayoutRef;

export function getPayout(vars: GetPayoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayoutData, GetPayoutVariables>;
export function getPayout(dc: DataConnect, vars: GetPayoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayoutData, GetPayoutVariables>;

interface ListMyPayoutsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPayoutsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyPayoutsData, undefined>;
  operationName: string;
}
export const listMyPayoutsRef: ListMyPayoutsRef;

export function listMyPayouts(options?: ExecuteQueryOptions): QueryPromise<ListMyPayoutsData, undefined>;
export function listMyPayouts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyPayoutsData, undefined>;

