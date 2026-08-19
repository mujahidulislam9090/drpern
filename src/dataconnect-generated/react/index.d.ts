import { CreateUserData, CreateUserVariables, UpdateUserBalanceData, UpdateUserBalanceVariables, DeleteUserData, GetUserData, ListUsersData, CreateFileData, CreateFileVariables, UpdateFileDescriptionData, UpdateFileDescriptionVariables, DeleteFileData, DeleteFileVariables, GetFileData, GetFileVariables, ListMyFilesData, CreateShortLinkData, CreateShortLinkVariables, UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables, DeleteShortLinkData, DeleteShortLinkVariables, GetShortLinkData, GetShortLinkVariables, ListMyShortLinksData, LogClickEventData, LogClickEventVariables, DeleteClickEventData, DeleteClickEventVariables, UpdateClickEventData, UpdateClickEventVariables, GetClickEventData, GetClickEventVariables, ListClickEventsData, CreatePayoutData, CreatePayoutVariables, UpdatePayoutStatusData, UpdatePayoutStatusVariables, DeletePayoutData, DeletePayoutVariables, GetPayoutData, GetPayoutVariables, ListMyPayoutsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useUpdateUserBalance(options?: useDataConnectMutationOptions<UpdateUserBalanceData, FirebaseError, UpdateUserBalanceVariables>): UseDataConnectMutationResult<UpdateUserBalanceData, UpdateUserBalanceVariables>;
export function useUpdateUserBalance(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserBalanceData, FirebaseError, UpdateUserBalanceVariables>): UseDataConnectMutationResult<UpdateUserBalanceData, UpdateUserBalanceVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useCreateFile(options?: useDataConnectMutationOptions<CreateFileData, FirebaseError, CreateFileVariables>): UseDataConnectMutationResult<CreateFileData, CreateFileVariables>;
export function useCreateFile(dc: DataConnect, options?: useDataConnectMutationOptions<CreateFileData, FirebaseError, CreateFileVariables>): UseDataConnectMutationResult<CreateFileData, CreateFileVariables>;

export function useUpdateFileDescription(options?: useDataConnectMutationOptions<UpdateFileDescriptionData, FirebaseError, UpdateFileDescriptionVariables>): UseDataConnectMutationResult<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;
export function useUpdateFileDescription(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateFileDescriptionData, FirebaseError, UpdateFileDescriptionVariables>): UseDataConnectMutationResult<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;

export function useDeleteFile(options?: useDataConnectMutationOptions<DeleteFileData, FirebaseError, DeleteFileVariables>): UseDataConnectMutationResult<DeleteFileData, DeleteFileVariables>;
export function useDeleteFile(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteFileData, FirebaseError, DeleteFileVariables>): UseDataConnectMutationResult<DeleteFileData, DeleteFileVariables>;

export function useGetFile(vars: GetFileVariables, options?: useDataConnectQueryOptions<GetFileData>): UseDataConnectQueryResult<GetFileData, GetFileVariables>;
export function useGetFile(dc: DataConnect, vars: GetFileVariables, options?: useDataConnectQueryOptions<GetFileData>): UseDataConnectQueryResult<GetFileData, GetFileVariables>;

export function useListMyFiles(options?: useDataConnectQueryOptions<ListMyFilesData>): UseDataConnectQueryResult<ListMyFilesData, undefined>;
export function useListMyFiles(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyFilesData>): UseDataConnectQueryResult<ListMyFilesData, undefined>;

export function useCreateShortLink(options?: useDataConnectMutationOptions<CreateShortLinkData, FirebaseError, CreateShortLinkVariables>): UseDataConnectMutationResult<CreateShortLinkData, CreateShortLinkVariables>;
export function useCreateShortLink(dc: DataConnect, options?: useDataConnectMutationOptions<CreateShortLinkData, FirebaseError, CreateShortLinkVariables>): UseDataConnectMutationResult<CreateShortLinkData, CreateShortLinkVariables>;

export function useUpdateShortLinkExpiry(options?: useDataConnectMutationOptions<UpdateShortLinkExpiryData, FirebaseError, UpdateShortLinkExpiryVariables>): UseDataConnectMutationResult<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;
export function useUpdateShortLinkExpiry(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateShortLinkExpiryData, FirebaseError, UpdateShortLinkExpiryVariables>): UseDataConnectMutationResult<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;

export function useDeleteShortLink(options?: useDataConnectMutationOptions<DeleteShortLinkData, FirebaseError, DeleteShortLinkVariables>): UseDataConnectMutationResult<DeleteShortLinkData, DeleteShortLinkVariables>;
export function useDeleteShortLink(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteShortLinkData, FirebaseError, DeleteShortLinkVariables>): UseDataConnectMutationResult<DeleteShortLinkData, DeleteShortLinkVariables>;

export function useGetShortLink(vars: GetShortLinkVariables, options?: useDataConnectQueryOptions<GetShortLinkData>): UseDataConnectQueryResult<GetShortLinkData, GetShortLinkVariables>;
export function useGetShortLink(dc: DataConnect, vars: GetShortLinkVariables, options?: useDataConnectQueryOptions<GetShortLinkData>): UseDataConnectQueryResult<GetShortLinkData, GetShortLinkVariables>;

export function useListMyShortLinks(options?: useDataConnectQueryOptions<ListMyShortLinksData>): UseDataConnectQueryResult<ListMyShortLinksData, undefined>;
export function useListMyShortLinks(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyShortLinksData>): UseDataConnectQueryResult<ListMyShortLinksData, undefined>;

export function useLogClickEvent(options?: useDataConnectMutationOptions<LogClickEventData, FirebaseError, LogClickEventVariables>): UseDataConnectMutationResult<LogClickEventData, LogClickEventVariables>;
export function useLogClickEvent(dc: DataConnect, options?: useDataConnectMutationOptions<LogClickEventData, FirebaseError, LogClickEventVariables>): UseDataConnectMutationResult<LogClickEventData, LogClickEventVariables>;

export function useDeleteClickEvent(options?: useDataConnectMutationOptions<DeleteClickEventData, FirebaseError, DeleteClickEventVariables>): UseDataConnectMutationResult<DeleteClickEventData, DeleteClickEventVariables>;
export function useDeleteClickEvent(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteClickEventData, FirebaseError, DeleteClickEventVariables>): UseDataConnectMutationResult<DeleteClickEventData, DeleteClickEventVariables>;

export function useUpdateClickEvent(options?: useDataConnectMutationOptions<UpdateClickEventData, FirebaseError, UpdateClickEventVariables>): UseDataConnectMutationResult<UpdateClickEventData, UpdateClickEventVariables>;
export function useUpdateClickEvent(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateClickEventData, FirebaseError, UpdateClickEventVariables>): UseDataConnectMutationResult<UpdateClickEventData, UpdateClickEventVariables>;

export function useGetClickEvent(vars: GetClickEventVariables, options?: useDataConnectQueryOptions<GetClickEventData>): UseDataConnectQueryResult<GetClickEventData, GetClickEventVariables>;
export function useGetClickEvent(dc: DataConnect, vars: GetClickEventVariables, options?: useDataConnectQueryOptions<GetClickEventData>): UseDataConnectQueryResult<GetClickEventData, GetClickEventVariables>;

export function useListClickEvents(options?: useDataConnectQueryOptions<ListClickEventsData>): UseDataConnectQueryResult<ListClickEventsData, undefined>;
export function useListClickEvents(dc: DataConnect, options?: useDataConnectQueryOptions<ListClickEventsData>): UseDataConnectQueryResult<ListClickEventsData, undefined>;

export function useCreatePayout(options?: useDataConnectMutationOptions<CreatePayoutData, FirebaseError, CreatePayoutVariables>): UseDataConnectMutationResult<CreatePayoutData, CreatePayoutVariables>;
export function useCreatePayout(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePayoutData, FirebaseError, CreatePayoutVariables>): UseDataConnectMutationResult<CreatePayoutData, CreatePayoutVariables>;

export function useUpdatePayoutStatus(options?: useDataConnectMutationOptions<UpdatePayoutStatusData, FirebaseError, UpdatePayoutStatusVariables>): UseDataConnectMutationResult<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;
export function useUpdatePayoutStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdatePayoutStatusData, FirebaseError, UpdatePayoutStatusVariables>): UseDataConnectMutationResult<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;

export function useDeletePayout(options?: useDataConnectMutationOptions<DeletePayoutData, FirebaseError, DeletePayoutVariables>): UseDataConnectMutationResult<DeletePayoutData, DeletePayoutVariables>;
export function useDeletePayout(dc: DataConnect, options?: useDataConnectMutationOptions<DeletePayoutData, FirebaseError, DeletePayoutVariables>): UseDataConnectMutationResult<DeletePayoutData, DeletePayoutVariables>;

export function useGetPayout(vars: GetPayoutVariables, options?: useDataConnectQueryOptions<GetPayoutData>): UseDataConnectQueryResult<GetPayoutData, GetPayoutVariables>;
export function useGetPayout(dc: DataConnect, vars: GetPayoutVariables, options?: useDataConnectQueryOptions<GetPayoutData>): UseDataConnectQueryResult<GetPayoutData, GetPayoutVariables>;

export function useListMyPayouts(options?: useDataConnectQueryOptions<ListMyPayoutsData>): UseDataConnectQueryResult<ListMyPayoutsData, undefined>;
export function useListMyPayouts(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyPayoutsData>): UseDataConnectQueryResult<ListMyPayoutsData, undefined>;
