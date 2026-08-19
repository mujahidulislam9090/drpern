# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*ListUsers*](#listusers)
  - [*GetFile*](#getfile)
  - [*ListMyFiles*](#listmyfiles)
  - [*GetShortLink*](#getshortlink)
  - [*ListMyShortLinks*](#listmyshortlinks)
  - [*GetClickEvent*](#getclickevent)
  - [*ListClickEvents*](#listclickevents)
  - [*GetPayout*](#getpayout)
  - [*ListMyPayouts*](#listmypayouts)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUserBalance*](#updateuserbalance)
  - [*DeleteUser*](#deleteuser)
  - [*CreateFile*](#createfile)
  - [*UpdateFileDescription*](#updatefiledescription)
  - [*DeleteFile*](#deletefile)
  - [*CreateShortLink*](#createshortlink)
  - [*UpdateShortLinkExpiry*](#updateshortlinkexpiry)
  - [*DeleteShortLink*](#deleteshortlink)
  - [*LogClickEvent*](#logclickevent)
  - [*DeleteClickEvent*](#deleteclickevent)
  - [*UpdateClickEvent*](#updateclickevent)
  - [*CreatePayout*](#createpayout)
  - [*UpdatePayoutStatus*](#updatepayoutstatus)
  - [*DeletePayout*](#deletepayout)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query has no variables.
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    username: string;
    email: string;
    balance: number;
  };
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser } from '@dataconnect/generated';


// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef } from '@dataconnect/generated';


// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    username: string;
  })[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetFile
You can execute the `GetFile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getFile(vars: GetFileVariables, options?: ExecuteQueryOptions): QueryPromise<GetFileData, GetFileVariables>;

interface GetFileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFileVariables): QueryRef<GetFileData, GetFileVariables>;
}
export const getFileRef: GetFileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFile(dc: DataConnect, vars: GetFileVariables, options?: ExecuteQueryOptions): QueryPromise<GetFileData, GetFileVariables>;

interface GetFileRef {
  ...
  (dc: DataConnect, vars: GetFileVariables): QueryRef<GetFileData, GetFileVariables>;
}
export const getFileRef: GetFileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFileRef:
```typescript
const name = getFileRef.operationName;
console.log(name);
```

### Variables
The `GetFile` query requires an argument of type `GetFileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetFileVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetFile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetFileData {
  file?: {
    originalFileName: string;
    storageUrl: string;
  };
}
```
### Using `GetFile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFile, GetFileVariables } from '@dataconnect/generated';

// The `GetFile` query requires an argument of type `GetFileVariables`:
const getFileVars: GetFileVariables = {
  id: ..., 
};

// Call the `getFile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFile(getFileVars);
// Variables can be defined inline as well.
const { data } = await getFile({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFile(dataConnect, getFileVars);

console.log(data.file);

// Or, you can use the `Promise` API.
getFile(getFileVars).then((response) => {
  const data = response.data;
  console.log(data.file);
});
```

### Using `GetFile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFileRef, GetFileVariables } from '@dataconnect/generated';

// The `GetFile` query requires an argument of type `GetFileVariables`:
const getFileVars: GetFileVariables = {
  id: ..., 
};

// Call the `getFileRef()` function to get a reference to the query.
const ref = getFileRef(getFileVars);
// Variables can be defined inline as well.
const ref = getFileRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFileRef(dataConnect, getFileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.file);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.file);
});
```

## ListMyFiles
You can execute the `ListMyFiles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyFiles(options?: ExecuteQueryOptions): QueryPromise<ListMyFilesData, undefined>;

interface ListMyFilesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyFilesData, undefined>;
}
export const listMyFilesRef: ListMyFilesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyFiles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyFilesData, undefined>;

interface ListMyFilesRef {
  ...
  (dc: DataConnect): QueryRef<ListMyFilesData, undefined>;
}
export const listMyFilesRef: ListMyFilesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyFilesRef:
```typescript
const name = listMyFilesRef.operationName;
console.log(name);
```

### Variables
The `ListMyFiles` query has no variables.
### Return Type
Recall that executing the `ListMyFiles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyFilesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyFilesData {
  files: ({
    originalFileName: string;
    fileSize?: Int64String | null;
  })[];
}
```
### Using `ListMyFiles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyFiles } from '@dataconnect/generated';


// Call the `listMyFiles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyFiles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyFiles(dataConnect);

console.log(data.files);

// Or, you can use the `Promise` API.
listMyFiles().then((response) => {
  const data = response.data;
  console.log(data.files);
});
```

### Using `ListMyFiles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyFilesRef } from '@dataconnect/generated';


// Call the `listMyFilesRef()` function to get a reference to the query.
const ref = listMyFilesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyFilesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.files);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.files);
});
```

## GetShortLink
You can execute the `GetShortLink` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getShortLink(vars: GetShortLinkVariables, options?: ExecuteQueryOptions): QueryPromise<GetShortLinkData, GetShortLinkVariables>;

interface GetShortLinkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetShortLinkVariables): QueryRef<GetShortLinkData, GetShortLinkVariables>;
}
export const getShortLinkRef: GetShortLinkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getShortLink(dc: DataConnect, vars: GetShortLinkVariables, options?: ExecuteQueryOptions): QueryPromise<GetShortLinkData, GetShortLinkVariables>;

interface GetShortLinkRef {
  ...
  (dc: DataConnect, vars: GetShortLinkVariables): QueryRef<GetShortLinkData, GetShortLinkVariables>;
}
export const getShortLinkRef: GetShortLinkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getShortLinkRef:
```typescript
const name = getShortLinkRef.operationName;
console.log(name);
```

### Variables
The `GetShortLink` query requires an argument of type `GetShortLinkVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetShortLinkVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetShortLink` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetShortLinkData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetShortLinkData {
  shortLink?: {
    slug: string;
    expiresAt?: TimestampString | null;
  };
}
```
### Using `GetShortLink`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getShortLink, GetShortLinkVariables } from '@dataconnect/generated';

// The `GetShortLink` query requires an argument of type `GetShortLinkVariables`:
const getShortLinkVars: GetShortLinkVariables = {
  id: ..., 
};

// Call the `getShortLink()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getShortLink(getShortLinkVars);
// Variables can be defined inline as well.
const { data } = await getShortLink({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getShortLink(dataConnect, getShortLinkVars);

console.log(data.shortLink);

// Or, you can use the `Promise` API.
getShortLink(getShortLinkVars).then((response) => {
  const data = response.data;
  console.log(data.shortLink);
});
```

### Using `GetShortLink`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getShortLinkRef, GetShortLinkVariables } from '@dataconnect/generated';

// The `GetShortLink` query requires an argument of type `GetShortLinkVariables`:
const getShortLinkVars: GetShortLinkVariables = {
  id: ..., 
};

// Call the `getShortLinkRef()` function to get a reference to the query.
const ref = getShortLinkRef(getShortLinkVars);
// Variables can be defined inline as well.
const ref = getShortLinkRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getShortLinkRef(dataConnect, getShortLinkVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.shortLink);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.shortLink);
});
```

## ListMyShortLinks
You can execute the `ListMyShortLinks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyShortLinks(options?: ExecuteQueryOptions): QueryPromise<ListMyShortLinksData, undefined>;

interface ListMyShortLinksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyShortLinksData, undefined>;
}
export const listMyShortLinksRef: ListMyShortLinksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyShortLinks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyShortLinksData, undefined>;

interface ListMyShortLinksRef {
  ...
  (dc: DataConnect): QueryRef<ListMyShortLinksData, undefined>;
}
export const listMyShortLinksRef: ListMyShortLinksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyShortLinksRef:
```typescript
const name = listMyShortLinksRef.operationName;
console.log(name);
```

### Variables
The `ListMyShortLinks` query has no variables.
### Return Type
Recall that executing the `ListMyShortLinks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyShortLinksData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyShortLinksData {
  shortLinks: ({
    slug: string;
  })[];
}
```
### Using `ListMyShortLinks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyShortLinks } from '@dataconnect/generated';


// Call the `listMyShortLinks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyShortLinks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyShortLinks(dataConnect);

console.log(data.shortLinks);

// Or, you can use the `Promise` API.
listMyShortLinks().then((response) => {
  const data = response.data;
  console.log(data.shortLinks);
});
```

### Using `ListMyShortLinks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyShortLinksRef } from '@dataconnect/generated';


// Call the `listMyShortLinksRef()` function to get a reference to the query.
const ref = listMyShortLinksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyShortLinksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.shortLinks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.shortLinks);
});
```

## GetClickEvent
You can execute the `GetClickEvent` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getClickEvent(vars: GetClickEventVariables, options?: ExecuteQueryOptions): QueryPromise<GetClickEventData, GetClickEventVariables>;

interface GetClickEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClickEventVariables): QueryRef<GetClickEventData, GetClickEventVariables>;
}
export const getClickEventRef: GetClickEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClickEvent(dc: DataConnect, vars: GetClickEventVariables, options?: ExecuteQueryOptions): QueryPromise<GetClickEventData, GetClickEventVariables>;

interface GetClickEventRef {
  ...
  (dc: DataConnect, vars: GetClickEventVariables): QueryRef<GetClickEventData, GetClickEventVariables>;
}
export const getClickEventRef: GetClickEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClickEventRef:
```typescript
const name = getClickEventRef.operationName;
console.log(name);
```

### Variables
The `GetClickEvent` query requires an argument of type `GetClickEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClickEventVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetClickEvent` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClickEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClickEventData {
  clickEvent?: {
    timestamp: TimestampString;
    countryCode?: string | null;
  };
}
```
### Using `GetClickEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClickEvent, GetClickEventVariables } from '@dataconnect/generated';

// The `GetClickEvent` query requires an argument of type `GetClickEventVariables`:
const getClickEventVars: GetClickEventVariables = {
  id: ..., 
};

// Call the `getClickEvent()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClickEvent(getClickEventVars);
// Variables can be defined inline as well.
const { data } = await getClickEvent({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClickEvent(dataConnect, getClickEventVars);

console.log(data.clickEvent);

// Or, you can use the `Promise` API.
getClickEvent(getClickEventVars).then((response) => {
  const data = response.data;
  console.log(data.clickEvent);
});
```

### Using `GetClickEvent`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClickEventRef, GetClickEventVariables } from '@dataconnect/generated';

// The `GetClickEvent` query requires an argument of type `GetClickEventVariables`:
const getClickEventVars: GetClickEventVariables = {
  id: ..., 
};

// Call the `getClickEventRef()` function to get a reference to the query.
const ref = getClickEventRef(getClickEventVars);
// Variables can be defined inline as well.
const ref = getClickEventRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClickEventRef(dataConnect, getClickEventVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clickEvent);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clickEvent);
});
```

## ListClickEvents
You can execute the `ListClickEvents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listClickEvents(options?: ExecuteQueryOptions): QueryPromise<ListClickEventsData, undefined>;

interface ListClickEventsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListClickEventsData, undefined>;
}
export const listClickEventsRef: ListClickEventsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listClickEvents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListClickEventsData, undefined>;

interface ListClickEventsRef {
  ...
  (dc: DataConnect): QueryRef<ListClickEventsData, undefined>;
}
export const listClickEventsRef: ListClickEventsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listClickEventsRef:
```typescript
const name = listClickEventsRef.operationName;
console.log(name);
```

### Variables
The `ListClickEvents` query has no variables.
### Return Type
Recall that executing the `ListClickEvents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListClickEventsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListClickEventsData {
  clickEvents: ({
    shortLinkId: UUIDString;
    ipAddress: string;
  })[];
}
```
### Using `ListClickEvents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listClickEvents } from '@dataconnect/generated';


// Call the `listClickEvents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listClickEvents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listClickEvents(dataConnect);

console.log(data.clickEvents);

// Or, you can use the `Promise` API.
listClickEvents().then((response) => {
  const data = response.data;
  console.log(data.clickEvents);
});
```

### Using `ListClickEvents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listClickEventsRef } from '@dataconnect/generated';


// Call the `listClickEventsRef()` function to get a reference to the query.
const ref = listClickEventsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listClickEventsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clickEvents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clickEvents);
});
```

## GetPayout
You can execute the `GetPayout` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPayout(vars: GetPayoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayoutData, GetPayoutVariables>;

interface GetPayoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPayoutVariables): QueryRef<GetPayoutData, GetPayoutVariables>;
}
export const getPayoutRef: GetPayoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPayout(dc: DataConnect, vars: GetPayoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayoutData, GetPayoutVariables>;

interface GetPayoutRef {
  ...
  (dc: DataConnect, vars: GetPayoutVariables): QueryRef<GetPayoutData, GetPayoutVariables>;
}
export const getPayoutRef: GetPayoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPayoutRef:
```typescript
const name = getPayoutRef.operationName;
console.log(name);
```

### Variables
The `GetPayout` query requires an argument of type `GetPayoutVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPayoutVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetPayout` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPayoutData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPayoutData {
  payout?: {
    amount: number;
    status: string;
  };
}
```
### Using `GetPayout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPayout, GetPayoutVariables } from '@dataconnect/generated';

// The `GetPayout` query requires an argument of type `GetPayoutVariables`:
const getPayoutVars: GetPayoutVariables = {
  id: ..., 
};

// Call the `getPayout()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPayout(getPayoutVars);
// Variables can be defined inline as well.
const { data } = await getPayout({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPayout(dataConnect, getPayoutVars);

console.log(data.payout);

// Or, you can use the `Promise` API.
getPayout(getPayoutVars).then((response) => {
  const data = response.data;
  console.log(data.payout);
});
```

### Using `GetPayout`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPayoutRef, GetPayoutVariables } from '@dataconnect/generated';

// The `GetPayout` query requires an argument of type `GetPayoutVariables`:
const getPayoutVars: GetPayoutVariables = {
  id: ..., 
};

// Call the `getPayoutRef()` function to get a reference to the query.
const ref = getPayoutRef(getPayoutVars);
// Variables can be defined inline as well.
const ref = getPayoutRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPayoutRef(dataConnect, getPayoutVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payout);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payout);
});
```

## ListMyPayouts
You can execute the `ListMyPayouts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyPayouts(options?: ExecuteQueryOptions): QueryPromise<ListMyPayoutsData, undefined>;

interface ListMyPayoutsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPayoutsData, undefined>;
}
export const listMyPayoutsRef: ListMyPayoutsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyPayouts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyPayoutsData, undefined>;

interface ListMyPayoutsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyPayoutsData, undefined>;
}
export const listMyPayoutsRef: ListMyPayoutsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyPayoutsRef:
```typescript
const name = listMyPayoutsRef.operationName;
console.log(name);
```

### Variables
The `ListMyPayouts` query has no variables.
### Return Type
Recall that executing the `ListMyPayouts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyPayoutsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyPayoutsData {
  payouts: ({
    amount: number;
    status: string;
  })[];
}
```
### Using `ListMyPayouts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyPayouts } from '@dataconnect/generated';


// Call the `listMyPayouts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyPayouts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyPayouts(dataConnect);

console.log(data.payouts);

// Or, you can use the `Promise` API.
listMyPayouts().then((response) => {
  const data = response.data;
  console.log(data.payouts);
});
```

### Using `ListMyPayouts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyPayoutsRef } from '@dataconnect/generated';


// Call the `listMyPayoutsRef()` function to get a reference to the query.
const ref = listMyPayoutsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyPayoutsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payouts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payouts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  username: string;
  email: string;
  balance: number;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  username: ..., 
  email: ..., 
  balance: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ username: ..., email: ..., balance: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  username: ..., 
  email: ..., 
  balance: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ username: ..., email: ..., balance: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUserBalance
You can execute the `UpdateUserBalance` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserBalance(vars: UpdateUserBalanceVariables): MutationPromise<UpdateUserBalanceData, UpdateUserBalanceVariables>;

interface UpdateUserBalanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserBalanceVariables): MutationRef<UpdateUserBalanceData, UpdateUserBalanceVariables>;
}
export const updateUserBalanceRef: UpdateUserBalanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserBalance(dc: DataConnect, vars: UpdateUserBalanceVariables): MutationPromise<UpdateUserBalanceData, UpdateUserBalanceVariables>;

interface UpdateUserBalanceRef {
  ...
  (dc: DataConnect, vars: UpdateUserBalanceVariables): MutationRef<UpdateUserBalanceData, UpdateUserBalanceVariables>;
}
export const updateUserBalanceRef: UpdateUserBalanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserBalanceRef:
```typescript
const name = updateUserBalanceRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserBalance` mutation requires an argument of type `UpdateUserBalanceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserBalanceVariables {
  balance: number;
}
```
### Return Type
Recall that executing the `UpdateUserBalance` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserBalanceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserBalanceData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserBalance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserBalance, UpdateUserBalanceVariables } from '@dataconnect/generated';

// The `UpdateUserBalance` mutation requires an argument of type `UpdateUserBalanceVariables`:
const updateUserBalanceVars: UpdateUserBalanceVariables = {
  balance: ..., 
};

// Call the `updateUserBalance()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserBalance(updateUserBalanceVars);
// Variables can be defined inline as well.
const { data } = await updateUserBalance({ balance: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserBalance(dataConnect, updateUserBalanceVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserBalance(updateUserBalanceVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserBalance`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserBalanceRef, UpdateUserBalanceVariables } from '@dataconnect/generated';

// The `UpdateUserBalance` mutation requires an argument of type `UpdateUserBalanceVariables`:
const updateUserBalanceVars: UpdateUserBalanceVariables = {
  balance: ..., 
};

// Call the `updateUserBalanceRef()` function to get a reference to the mutation.
const ref = updateUserBalanceRef(updateUserBalanceVars);
// Variables can be defined inline as well.
const ref = updateUserBalanceRef({ balance: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserBalanceRef(dataConnect, updateUserBalanceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateFile
You can execute the `CreateFile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createFile(vars: CreateFileVariables): MutationPromise<CreateFileData, CreateFileVariables>;

interface CreateFileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFileVariables): MutationRef<CreateFileData, CreateFileVariables>;
}
export const createFileRef: CreateFileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFile(dc: DataConnect, vars: CreateFileVariables): MutationPromise<CreateFileData, CreateFileVariables>;

interface CreateFileRef {
  ...
  (dc: DataConnect, vars: CreateFileVariables): MutationRef<CreateFileData, CreateFileVariables>;
}
export const createFileRef: CreateFileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFileRef:
```typescript
const name = createFileRef.operationName;
console.log(name);
```

### Variables
The `CreateFile` mutation requires an argument of type `CreateFileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFileVariables {
  fileName: string;
  url: string;
  mime: string;
  size: Int64String;
}
```
### Return Type
Recall that executing the `CreateFile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFileData {
  file_insert: File_Key;
}
```
### Using `CreateFile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFile, CreateFileVariables } from '@dataconnect/generated';

// The `CreateFile` mutation requires an argument of type `CreateFileVariables`:
const createFileVars: CreateFileVariables = {
  fileName: ..., 
  url: ..., 
  mime: ..., 
  size: ..., 
};

// Call the `createFile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFile(createFileVars);
// Variables can be defined inline as well.
const { data } = await createFile({ fileName: ..., url: ..., mime: ..., size: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFile(dataConnect, createFileVars);

console.log(data.file_insert);

// Or, you can use the `Promise` API.
createFile(createFileVars).then((response) => {
  const data = response.data;
  console.log(data.file_insert);
});
```

### Using `CreateFile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFileRef, CreateFileVariables } from '@dataconnect/generated';

// The `CreateFile` mutation requires an argument of type `CreateFileVariables`:
const createFileVars: CreateFileVariables = {
  fileName: ..., 
  url: ..., 
  mime: ..., 
  size: ..., 
};

// Call the `createFileRef()` function to get a reference to the mutation.
const ref = createFileRef(createFileVars);
// Variables can be defined inline as well.
const ref = createFileRef({ fileName: ..., url: ..., mime: ..., size: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFileRef(dataConnect, createFileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.file_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.file_insert);
});
```

## UpdateFileDescription
You can execute the `UpdateFileDescription` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateFileDescription(vars: UpdateFileDescriptionVariables): MutationPromise<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;

interface UpdateFileDescriptionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFileDescriptionVariables): MutationRef<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;
}
export const updateFileDescriptionRef: UpdateFileDescriptionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateFileDescription(dc: DataConnect, vars: UpdateFileDescriptionVariables): MutationPromise<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;

interface UpdateFileDescriptionRef {
  ...
  (dc: DataConnect, vars: UpdateFileDescriptionVariables): MutationRef<UpdateFileDescriptionData, UpdateFileDescriptionVariables>;
}
export const updateFileDescriptionRef: UpdateFileDescriptionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateFileDescriptionRef:
```typescript
const name = updateFileDescriptionRef.operationName;
console.log(name);
```

### Variables
The `UpdateFileDescription` mutation requires an argument of type `UpdateFileDescriptionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateFileDescriptionVariables {
  id: UUIDString;
  desc: string;
}
```
### Return Type
Recall that executing the `UpdateFileDescription` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateFileDescriptionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateFileDescriptionData {
  file_update?: File_Key | null;
}
```
### Using `UpdateFileDescription`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateFileDescription, UpdateFileDescriptionVariables } from '@dataconnect/generated';

// The `UpdateFileDescription` mutation requires an argument of type `UpdateFileDescriptionVariables`:
const updateFileDescriptionVars: UpdateFileDescriptionVariables = {
  id: ..., 
  desc: ..., 
};

// Call the `updateFileDescription()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateFileDescription(updateFileDescriptionVars);
// Variables can be defined inline as well.
const { data } = await updateFileDescription({ id: ..., desc: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateFileDescription(dataConnect, updateFileDescriptionVars);

console.log(data.file_update);

// Or, you can use the `Promise` API.
updateFileDescription(updateFileDescriptionVars).then((response) => {
  const data = response.data;
  console.log(data.file_update);
});
```

### Using `UpdateFileDescription`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateFileDescriptionRef, UpdateFileDescriptionVariables } from '@dataconnect/generated';

// The `UpdateFileDescription` mutation requires an argument of type `UpdateFileDescriptionVariables`:
const updateFileDescriptionVars: UpdateFileDescriptionVariables = {
  id: ..., 
  desc: ..., 
};

// Call the `updateFileDescriptionRef()` function to get a reference to the mutation.
const ref = updateFileDescriptionRef(updateFileDescriptionVars);
// Variables can be defined inline as well.
const ref = updateFileDescriptionRef({ id: ..., desc: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateFileDescriptionRef(dataConnect, updateFileDescriptionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.file_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.file_update);
});
```

## DeleteFile
You can execute the `DeleteFile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteFile(vars: DeleteFileVariables): MutationPromise<DeleteFileData, DeleteFileVariables>;

interface DeleteFileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFileVariables): MutationRef<DeleteFileData, DeleteFileVariables>;
}
export const deleteFileRef: DeleteFileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteFile(dc: DataConnect, vars: DeleteFileVariables): MutationPromise<DeleteFileData, DeleteFileVariables>;

interface DeleteFileRef {
  ...
  (dc: DataConnect, vars: DeleteFileVariables): MutationRef<DeleteFileData, DeleteFileVariables>;
}
export const deleteFileRef: DeleteFileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteFileRef:
```typescript
const name = deleteFileRef.operationName;
console.log(name);
```

### Variables
The `DeleteFile` mutation requires an argument of type `DeleteFileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteFileVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteFile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteFileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteFileData {
  file_delete?: File_Key | null;
}
```
### Using `DeleteFile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteFile, DeleteFileVariables } from '@dataconnect/generated';

// The `DeleteFile` mutation requires an argument of type `DeleteFileVariables`:
const deleteFileVars: DeleteFileVariables = {
  id: ..., 
};

// Call the `deleteFile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteFile(deleteFileVars);
// Variables can be defined inline as well.
const { data } = await deleteFile({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteFile(dataConnect, deleteFileVars);

console.log(data.file_delete);

// Or, you can use the `Promise` API.
deleteFile(deleteFileVars).then((response) => {
  const data = response.data;
  console.log(data.file_delete);
});
```

### Using `DeleteFile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteFileRef, DeleteFileVariables } from '@dataconnect/generated';

// The `DeleteFile` mutation requires an argument of type `DeleteFileVariables`:
const deleteFileVars: DeleteFileVariables = {
  id: ..., 
};

// Call the `deleteFileRef()` function to get a reference to the mutation.
const ref = deleteFileRef(deleteFileVars);
// Variables can be defined inline as well.
const ref = deleteFileRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteFileRef(dataConnect, deleteFileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.file_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.file_delete);
});
```

## CreateShortLink
You can execute the `CreateShortLink` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createShortLink(vars: CreateShortLinkVariables): MutationPromise<CreateShortLinkData, CreateShortLinkVariables>;

interface CreateShortLinkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateShortLinkVariables): MutationRef<CreateShortLinkData, CreateShortLinkVariables>;
}
export const createShortLinkRef: CreateShortLinkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createShortLink(dc: DataConnect, vars: CreateShortLinkVariables): MutationPromise<CreateShortLinkData, CreateShortLinkVariables>;

interface CreateShortLinkRef {
  ...
  (dc: DataConnect, vars: CreateShortLinkVariables): MutationRef<CreateShortLinkData, CreateShortLinkVariables>;
}
export const createShortLinkRef: CreateShortLinkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createShortLinkRef:
```typescript
const name = createShortLinkRef.operationName;
console.log(name);
```

### Variables
The `CreateShortLink` mutation requires an argument of type `CreateShortLinkVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateShortLinkVariables {
  slug: string;
  fileId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateShortLink` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateShortLinkData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateShortLinkData {
  shortLink_insert: ShortLink_Key;
}
```
### Using `CreateShortLink`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createShortLink, CreateShortLinkVariables } from '@dataconnect/generated';

// The `CreateShortLink` mutation requires an argument of type `CreateShortLinkVariables`:
const createShortLinkVars: CreateShortLinkVariables = {
  slug: ..., 
  fileId: ..., 
};

// Call the `createShortLink()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createShortLink(createShortLinkVars);
// Variables can be defined inline as well.
const { data } = await createShortLink({ slug: ..., fileId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createShortLink(dataConnect, createShortLinkVars);

console.log(data.shortLink_insert);

// Or, you can use the `Promise` API.
createShortLink(createShortLinkVars).then((response) => {
  const data = response.data;
  console.log(data.shortLink_insert);
});
```

### Using `CreateShortLink`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createShortLinkRef, CreateShortLinkVariables } from '@dataconnect/generated';

// The `CreateShortLink` mutation requires an argument of type `CreateShortLinkVariables`:
const createShortLinkVars: CreateShortLinkVariables = {
  slug: ..., 
  fileId: ..., 
};

// Call the `createShortLinkRef()` function to get a reference to the mutation.
const ref = createShortLinkRef(createShortLinkVars);
// Variables can be defined inline as well.
const ref = createShortLinkRef({ slug: ..., fileId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createShortLinkRef(dataConnect, createShortLinkVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shortLink_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shortLink_insert);
});
```

## UpdateShortLinkExpiry
You can execute the `UpdateShortLinkExpiry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateShortLinkExpiry(vars: UpdateShortLinkExpiryVariables): MutationPromise<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;

interface UpdateShortLinkExpiryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateShortLinkExpiryVariables): MutationRef<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;
}
export const updateShortLinkExpiryRef: UpdateShortLinkExpiryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateShortLinkExpiry(dc: DataConnect, vars: UpdateShortLinkExpiryVariables): MutationPromise<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;

interface UpdateShortLinkExpiryRef {
  ...
  (dc: DataConnect, vars: UpdateShortLinkExpiryVariables): MutationRef<UpdateShortLinkExpiryData, UpdateShortLinkExpiryVariables>;
}
export const updateShortLinkExpiryRef: UpdateShortLinkExpiryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateShortLinkExpiryRef:
```typescript
const name = updateShortLinkExpiryRef.operationName;
console.log(name);
```

### Variables
The `UpdateShortLinkExpiry` mutation requires an argument of type `UpdateShortLinkExpiryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateShortLinkExpiryVariables {
  id: UUIDString;
  expiresAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpdateShortLinkExpiry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateShortLinkExpiryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateShortLinkExpiryData {
  shortLink_update?: ShortLink_Key | null;
}
```
### Using `UpdateShortLinkExpiry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateShortLinkExpiry, UpdateShortLinkExpiryVariables } from '@dataconnect/generated';

// The `UpdateShortLinkExpiry` mutation requires an argument of type `UpdateShortLinkExpiryVariables`:
const updateShortLinkExpiryVars: UpdateShortLinkExpiryVariables = {
  id: ..., 
  expiresAt: ..., // optional
};

// Call the `updateShortLinkExpiry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateShortLinkExpiry(updateShortLinkExpiryVars);
// Variables can be defined inline as well.
const { data } = await updateShortLinkExpiry({ id: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateShortLinkExpiry(dataConnect, updateShortLinkExpiryVars);

console.log(data.shortLink_update);

// Or, you can use the `Promise` API.
updateShortLinkExpiry(updateShortLinkExpiryVars).then((response) => {
  const data = response.data;
  console.log(data.shortLink_update);
});
```

### Using `UpdateShortLinkExpiry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateShortLinkExpiryRef, UpdateShortLinkExpiryVariables } from '@dataconnect/generated';

// The `UpdateShortLinkExpiry` mutation requires an argument of type `UpdateShortLinkExpiryVariables`:
const updateShortLinkExpiryVars: UpdateShortLinkExpiryVariables = {
  id: ..., 
  expiresAt: ..., // optional
};

// Call the `updateShortLinkExpiryRef()` function to get a reference to the mutation.
const ref = updateShortLinkExpiryRef(updateShortLinkExpiryVars);
// Variables can be defined inline as well.
const ref = updateShortLinkExpiryRef({ id: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateShortLinkExpiryRef(dataConnect, updateShortLinkExpiryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shortLink_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shortLink_update);
});
```

## DeleteShortLink
You can execute the `DeleteShortLink` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteShortLink(vars: DeleteShortLinkVariables): MutationPromise<DeleteShortLinkData, DeleteShortLinkVariables>;

interface DeleteShortLinkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteShortLinkVariables): MutationRef<DeleteShortLinkData, DeleteShortLinkVariables>;
}
export const deleteShortLinkRef: DeleteShortLinkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteShortLink(dc: DataConnect, vars: DeleteShortLinkVariables): MutationPromise<DeleteShortLinkData, DeleteShortLinkVariables>;

interface DeleteShortLinkRef {
  ...
  (dc: DataConnect, vars: DeleteShortLinkVariables): MutationRef<DeleteShortLinkData, DeleteShortLinkVariables>;
}
export const deleteShortLinkRef: DeleteShortLinkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteShortLinkRef:
```typescript
const name = deleteShortLinkRef.operationName;
console.log(name);
```

### Variables
The `DeleteShortLink` mutation requires an argument of type `DeleteShortLinkVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteShortLinkVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteShortLink` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteShortLinkData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteShortLinkData {
  shortLink_delete?: ShortLink_Key | null;
}
```
### Using `DeleteShortLink`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteShortLink, DeleteShortLinkVariables } from '@dataconnect/generated';

// The `DeleteShortLink` mutation requires an argument of type `DeleteShortLinkVariables`:
const deleteShortLinkVars: DeleteShortLinkVariables = {
  id: ..., 
};

// Call the `deleteShortLink()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteShortLink(deleteShortLinkVars);
// Variables can be defined inline as well.
const { data } = await deleteShortLink({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteShortLink(dataConnect, deleteShortLinkVars);

console.log(data.shortLink_delete);

// Or, you can use the `Promise` API.
deleteShortLink(deleteShortLinkVars).then((response) => {
  const data = response.data;
  console.log(data.shortLink_delete);
});
```

### Using `DeleteShortLink`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteShortLinkRef, DeleteShortLinkVariables } from '@dataconnect/generated';

// The `DeleteShortLink` mutation requires an argument of type `DeleteShortLinkVariables`:
const deleteShortLinkVars: DeleteShortLinkVariables = {
  id: ..., 
};

// Call the `deleteShortLinkRef()` function to get a reference to the mutation.
const ref = deleteShortLinkRef(deleteShortLinkVars);
// Variables can be defined inline as well.
const ref = deleteShortLinkRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteShortLinkRef(dataConnect, deleteShortLinkVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shortLink_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shortLink_delete);
});
```

## LogClickEvent
You can execute the `LogClickEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
logClickEvent(vars: LogClickEventVariables): MutationPromise<LogClickEventData, LogClickEventVariables>;

interface LogClickEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogClickEventVariables): MutationRef<LogClickEventData, LogClickEventVariables>;
}
export const logClickEventRef: LogClickEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logClickEvent(dc: DataConnect, vars: LogClickEventVariables): MutationPromise<LogClickEventData, LogClickEventVariables>;

interface LogClickEventRef {
  ...
  (dc: DataConnect, vars: LogClickEventVariables): MutationRef<LogClickEventData, LogClickEventVariables>;
}
export const logClickEventRef: LogClickEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logClickEventRef:
```typescript
const name = logClickEventRef.operationName;
console.log(name);
```

### Variables
The `LogClickEvent` mutation requires an argument of type `LogClickEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogClickEventVariables {
  shortLinkId: UUIDString;
  ip: string;
  country?: string | null;
}
```
### Return Type
Recall that executing the `LogClickEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogClickEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogClickEventData {
  clickEvent_insert: ClickEvent_Key;
}
```
### Using `LogClickEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logClickEvent, LogClickEventVariables } from '@dataconnect/generated';

// The `LogClickEvent` mutation requires an argument of type `LogClickEventVariables`:
const logClickEventVars: LogClickEventVariables = {
  shortLinkId: ..., 
  ip: ..., 
  country: ..., // optional
};

// Call the `logClickEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logClickEvent(logClickEventVars);
// Variables can be defined inline as well.
const { data } = await logClickEvent({ shortLinkId: ..., ip: ..., country: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logClickEvent(dataConnect, logClickEventVars);

console.log(data.clickEvent_insert);

// Or, you can use the `Promise` API.
logClickEvent(logClickEventVars).then((response) => {
  const data = response.data;
  console.log(data.clickEvent_insert);
});
```

### Using `LogClickEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logClickEventRef, LogClickEventVariables } from '@dataconnect/generated';

// The `LogClickEvent` mutation requires an argument of type `LogClickEventVariables`:
const logClickEventVars: LogClickEventVariables = {
  shortLinkId: ..., 
  ip: ..., 
  country: ..., // optional
};

// Call the `logClickEventRef()` function to get a reference to the mutation.
const ref = logClickEventRef(logClickEventVars);
// Variables can be defined inline as well.
const ref = logClickEventRef({ shortLinkId: ..., ip: ..., country: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logClickEventRef(dataConnect, logClickEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.clickEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.clickEvent_insert);
});
```

## DeleteClickEvent
You can execute the `DeleteClickEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteClickEvent(vars: DeleteClickEventVariables): MutationPromise<DeleteClickEventData, DeleteClickEventVariables>;

interface DeleteClickEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteClickEventVariables): MutationRef<DeleteClickEventData, DeleteClickEventVariables>;
}
export const deleteClickEventRef: DeleteClickEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteClickEvent(dc: DataConnect, vars: DeleteClickEventVariables): MutationPromise<DeleteClickEventData, DeleteClickEventVariables>;

interface DeleteClickEventRef {
  ...
  (dc: DataConnect, vars: DeleteClickEventVariables): MutationRef<DeleteClickEventData, DeleteClickEventVariables>;
}
export const deleteClickEventRef: DeleteClickEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteClickEventRef:
```typescript
const name = deleteClickEventRef.operationName;
console.log(name);
```

### Variables
The `DeleteClickEvent` mutation requires an argument of type `DeleteClickEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteClickEventVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteClickEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteClickEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteClickEventData {
  clickEvent_delete?: ClickEvent_Key | null;
}
```
### Using `DeleteClickEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteClickEvent, DeleteClickEventVariables } from '@dataconnect/generated';

// The `DeleteClickEvent` mutation requires an argument of type `DeleteClickEventVariables`:
const deleteClickEventVars: DeleteClickEventVariables = {
  id: ..., 
};

// Call the `deleteClickEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteClickEvent(deleteClickEventVars);
// Variables can be defined inline as well.
const { data } = await deleteClickEvent({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteClickEvent(dataConnect, deleteClickEventVars);

console.log(data.clickEvent_delete);

// Or, you can use the `Promise` API.
deleteClickEvent(deleteClickEventVars).then((response) => {
  const data = response.data;
  console.log(data.clickEvent_delete);
});
```

### Using `DeleteClickEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteClickEventRef, DeleteClickEventVariables } from '@dataconnect/generated';

// The `DeleteClickEvent` mutation requires an argument of type `DeleteClickEventVariables`:
const deleteClickEventVars: DeleteClickEventVariables = {
  id: ..., 
};

// Call the `deleteClickEventRef()` function to get a reference to the mutation.
const ref = deleteClickEventRef(deleteClickEventVars);
// Variables can be defined inline as well.
const ref = deleteClickEventRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteClickEventRef(dataConnect, deleteClickEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.clickEvent_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.clickEvent_delete);
});
```

## UpdateClickEvent
You can execute the `UpdateClickEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateClickEvent(vars: UpdateClickEventVariables): MutationPromise<UpdateClickEventData, UpdateClickEventVariables>;

interface UpdateClickEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClickEventVariables): MutationRef<UpdateClickEventData, UpdateClickEventVariables>;
}
export const updateClickEventRef: UpdateClickEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClickEvent(dc: DataConnect, vars: UpdateClickEventVariables): MutationPromise<UpdateClickEventData, UpdateClickEventVariables>;

interface UpdateClickEventRef {
  ...
  (dc: DataConnect, vars: UpdateClickEventVariables): MutationRef<UpdateClickEventData, UpdateClickEventVariables>;
}
export const updateClickEventRef: UpdateClickEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClickEventRef:
```typescript
const name = updateClickEventRef.operationName;
console.log(name);
```

### Variables
The `UpdateClickEvent` mutation requires an argument of type `UpdateClickEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClickEventVariables {
  id: UUIDString;
  country?: string | null;
}
```
### Return Type
Recall that executing the `UpdateClickEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClickEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClickEventData {
  clickEvent_update?: ClickEvent_Key | null;
}
```
### Using `UpdateClickEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClickEvent, UpdateClickEventVariables } from '@dataconnect/generated';

// The `UpdateClickEvent` mutation requires an argument of type `UpdateClickEventVariables`:
const updateClickEventVars: UpdateClickEventVariables = {
  id: ..., 
  country: ..., // optional
};

// Call the `updateClickEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClickEvent(updateClickEventVars);
// Variables can be defined inline as well.
const { data } = await updateClickEvent({ id: ..., country: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClickEvent(dataConnect, updateClickEventVars);

console.log(data.clickEvent_update);

// Or, you can use the `Promise` API.
updateClickEvent(updateClickEventVars).then((response) => {
  const data = response.data;
  console.log(data.clickEvent_update);
});
```

### Using `UpdateClickEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClickEventRef, UpdateClickEventVariables } from '@dataconnect/generated';

// The `UpdateClickEvent` mutation requires an argument of type `UpdateClickEventVariables`:
const updateClickEventVars: UpdateClickEventVariables = {
  id: ..., 
  country: ..., // optional
};

// Call the `updateClickEventRef()` function to get a reference to the mutation.
const ref = updateClickEventRef(updateClickEventVars);
// Variables can be defined inline as well.
const ref = updateClickEventRef({ id: ..., country: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClickEventRef(dataConnect, updateClickEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.clickEvent_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.clickEvent_update);
});
```

## CreatePayout
You can execute the `CreatePayout` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPayout(vars: CreatePayoutVariables): MutationPromise<CreatePayoutData, CreatePayoutVariables>;

interface CreatePayoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePayoutVariables): MutationRef<CreatePayoutData, CreatePayoutVariables>;
}
export const createPayoutRef: CreatePayoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPayout(dc: DataConnect, vars: CreatePayoutVariables): MutationPromise<CreatePayoutData, CreatePayoutVariables>;

interface CreatePayoutRef {
  ...
  (dc: DataConnect, vars: CreatePayoutVariables): MutationRef<CreatePayoutData, CreatePayoutVariables>;
}
export const createPayoutRef: CreatePayoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPayoutRef:
```typescript
const name = createPayoutRef.operationName;
console.log(name);
```

### Variables
The `CreatePayout` mutation requires an argument of type `CreatePayoutVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePayoutVariables {
  amount: number;
  status: string;
}
```
### Return Type
Recall that executing the `CreatePayout` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePayoutData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePayoutData {
  payout_insert: Payout_Key;
}
```
### Using `CreatePayout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPayout, CreatePayoutVariables } from '@dataconnect/generated';

// The `CreatePayout` mutation requires an argument of type `CreatePayoutVariables`:
const createPayoutVars: CreatePayoutVariables = {
  amount: ..., 
  status: ..., 
};

// Call the `createPayout()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPayout(createPayoutVars);
// Variables can be defined inline as well.
const { data } = await createPayout({ amount: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPayout(dataConnect, createPayoutVars);

console.log(data.payout_insert);

// Or, you can use the `Promise` API.
createPayout(createPayoutVars).then((response) => {
  const data = response.data;
  console.log(data.payout_insert);
});
```

### Using `CreatePayout`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPayoutRef, CreatePayoutVariables } from '@dataconnect/generated';

// The `CreatePayout` mutation requires an argument of type `CreatePayoutVariables`:
const createPayoutVars: CreatePayoutVariables = {
  amount: ..., 
  status: ..., 
};

// Call the `createPayoutRef()` function to get a reference to the mutation.
const ref = createPayoutRef(createPayoutVars);
// Variables can be defined inline as well.
const ref = createPayoutRef({ amount: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPayoutRef(dataConnect, createPayoutVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payout_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payout_insert);
});
```

## UpdatePayoutStatus
You can execute the `UpdatePayoutStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePayoutStatus(vars: UpdatePayoutStatusVariables): MutationPromise<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;

interface UpdatePayoutStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePayoutStatusVariables): MutationRef<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;
}
export const updatePayoutStatusRef: UpdatePayoutStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePayoutStatus(dc: DataConnect, vars: UpdatePayoutStatusVariables): MutationPromise<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;

interface UpdatePayoutStatusRef {
  ...
  (dc: DataConnect, vars: UpdatePayoutStatusVariables): MutationRef<UpdatePayoutStatusData, UpdatePayoutStatusVariables>;
}
export const updatePayoutStatusRef: UpdatePayoutStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePayoutStatusRef:
```typescript
const name = updatePayoutStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdatePayoutStatus` mutation requires an argument of type `UpdatePayoutStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePayoutStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdatePayoutStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePayoutStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePayoutStatusData {
  payout_update?: Payout_Key | null;
}
```
### Using `UpdatePayoutStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePayoutStatus, UpdatePayoutStatusVariables } from '@dataconnect/generated';

// The `UpdatePayoutStatus` mutation requires an argument of type `UpdatePayoutStatusVariables`:
const updatePayoutStatusVars: UpdatePayoutStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updatePayoutStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePayoutStatus(updatePayoutStatusVars);
// Variables can be defined inline as well.
const { data } = await updatePayoutStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePayoutStatus(dataConnect, updatePayoutStatusVars);

console.log(data.payout_update);

// Or, you can use the `Promise` API.
updatePayoutStatus(updatePayoutStatusVars).then((response) => {
  const data = response.data;
  console.log(data.payout_update);
});
```

### Using `UpdatePayoutStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePayoutStatusRef, UpdatePayoutStatusVariables } from '@dataconnect/generated';

// The `UpdatePayoutStatus` mutation requires an argument of type `UpdatePayoutStatusVariables`:
const updatePayoutStatusVars: UpdatePayoutStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updatePayoutStatusRef()` function to get a reference to the mutation.
const ref = updatePayoutStatusRef(updatePayoutStatusVars);
// Variables can be defined inline as well.
const ref = updatePayoutStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePayoutStatusRef(dataConnect, updatePayoutStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payout_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payout_update);
});
```

## DeletePayout
You can execute the `DeletePayout` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deletePayout(vars: DeletePayoutVariables): MutationPromise<DeletePayoutData, DeletePayoutVariables>;

interface DeletePayoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePayoutVariables): MutationRef<DeletePayoutData, DeletePayoutVariables>;
}
export const deletePayoutRef: DeletePayoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePayout(dc: DataConnect, vars: DeletePayoutVariables): MutationPromise<DeletePayoutData, DeletePayoutVariables>;

interface DeletePayoutRef {
  ...
  (dc: DataConnect, vars: DeletePayoutVariables): MutationRef<DeletePayoutData, DeletePayoutVariables>;
}
export const deletePayoutRef: DeletePayoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePayoutRef:
```typescript
const name = deletePayoutRef.operationName;
console.log(name);
```

### Variables
The `DeletePayout` mutation requires an argument of type `DeletePayoutVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePayoutVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeletePayout` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePayoutData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePayoutData {
  payout_delete?: Payout_Key | null;
}
```
### Using `DeletePayout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePayout, DeletePayoutVariables } from '@dataconnect/generated';

// The `DeletePayout` mutation requires an argument of type `DeletePayoutVariables`:
const deletePayoutVars: DeletePayoutVariables = {
  id: ..., 
};

// Call the `deletePayout()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePayout(deletePayoutVars);
// Variables can be defined inline as well.
const { data } = await deletePayout({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePayout(dataConnect, deletePayoutVars);

console.log(data.payout_delete);

// Or, you can use the `Promise` API.
deletePayout(deletePayoutVars).then((response) => {
  const data = response.data;
  console.log(data.payout_delete);
});
```

### Using `DeletePayout`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePayoutRef, DeletePayoutVariables } from '@dataconnect/generated';

// The `DeletePayout` mutation requires an argument of type `DeletePayoutVariables`:
const deletePayoutVars: DeletePayoutVariables = {
  id: ..., 
};

// Call the `deletePayoutRef()` function to get a reference to the mutation.
const ref = deletePayoutRef(deletePayoutVars);
// Variables can be defined inline as well.
const ref = deletePayoutRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePayoutRef(dataConnect, deletePayoutVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payout_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payout_delete);
});
```

