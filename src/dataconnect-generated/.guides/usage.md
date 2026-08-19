# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useUpdateUserBalance, useDeleteUser, useGetUser, useListUsers, useCreateFile, useUpdateFileDescription, useDeleteFile, useGetFile, useListMyFiles } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUserBalance(updateUserBalanceVars);

const { data, isPending, isSuccess, isError, error } = useDeleteUser();

const { data, isPending, isSuccess, isError, error } = useGetUser();

const { data, isPending, isSuccess, isError, error } = useListUsers();

const { data, isPending, isSuccess, isError, error } = useCreateFile(createFileVars);

const { data, isPending, isSuccess, isError, error } = useUpdateFileDescription(updateFileDescriptionVars);

const { data, isPending, isSuccess, isError, error } = useDeleteFile(deleteFileVars);

const { data, isPending, isSuccess, isError, error } = useGetFile(getFileVars);

const { data, isPending, isSuccess, isError, error } = useListMyFiles();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUserBalance, deleteUser, getUser, listUsers, createFile, updateFileDescription, deleteFile, getFile, listMyFiles } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUserBalance:  For variables, look at type UpdateUserBalanceVars in ../index.d.ts
const { data } = await UpdateUserBalance(dataConnect, updateUserBalanceVars);

// Operation DeleteUser: 
const { data } = await DeleteUser(dataConnect);

// Operation GetUser: 
const { data } = await GetUser(dataConnect);

// Operation ListUsers: 
const { data } = await ListUsers(dataConnect);

// Operation CreateFile:  For variables, look at type CreateFileVars in ../index.d.ts
const { data } = await CreateFile(dataConnect, createFileVars);

// Operation UpdateFileDescription:  For variables, look at type UpdateFileDescriptionVars in ../index.d.ts
const { data } = await UpdateFileDescription(dataConnect, updateFileDescriptionVars);

// Operation DeleteFile:  For variables, look at type DeleteFileVars in ../index.d.ts
const { data } = await DeleteFile(dataConnect, deleteFileVars);

// Operation GetFile:  For variables, look at type GetFileVars in ../index.d.ts
const { data } = await GetFile(dataConnect, getFileVars);

// Operation ListMyFiles: 
const { data } = await ListMyFiles(dataConnect);


```