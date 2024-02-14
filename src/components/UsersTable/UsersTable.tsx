import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  deleteUsers,
  getUsersState,
  sortEmail,
  sortLastLogin,
  sortName,
  sortStatus,
  updateUser,
  UserState,
} from 'src/store/slice/admin.slice';
import { fetchSignOut } from 'src/store/slice/user.slice';
import { EnhancedTableToolbar } from './EnhancedTableToolbar';

const HEADER_TABLE = ['Name', 'Email', 'Last login', 'Status'];

export default function UsersTable() {
  const { users, uid: uidAdmin } = useAppSelector(getUsersState);

  const [sort, setSort] = useState<{
    index: number;
    order: 'asc' | 'desc';
  }>({ index: 0, order: 'asc' });

  const [checkedUsers, setCheckedUsers] = useState<{ [key: string]: boolean }>(
    {}
  );

  const checked = Object.keys(checkedUsers);

  const dispatch = useAppDispatch();

  const handleSort = (index: number) => {
    const orderBy = sort.order === 'asc' ? 'desc' : 'asc';

    switch (HEADER_TABLE[index]) {
      case 'Name':
        dispatch(sortName(orderBy));
        break;
      case 'Email':
        dispatch(sortEmail(orderBy));
        break;
      case 'Last login':
        dispatch(sortLastLogin(orderBy));
        break;
      case 'Status':
        dispatch(sortStatus(orderBy));
        break;
      default:
    }

    setSort({ index, order: orderBy });
  };

  const handleDeleteUsers = async () => {
    await dispatch(deleteUsers(checked));

    setCheckedUsers((state) => {
      const newState = { ...state };
      checked.forEach((uid) => {
        delete newState[uid];
      });
      return newState;
    });

    if (uidAdmin && checked.includes(uidAdmin)) {
      await dispatch(fetchSignOut());
    }
  };

  const handleBlockedUsers = async (isBlock: boolean) => {
    for (const [uid] of Object.entries(checkedUsers)) {
      if (isBlock) {
        const result = await dispatch(updateUser({ uid, disabled: true }));

        setCheckedUsers((state) => ({
          ...state,
          [(result.payload as UserState).uid]: (result.payload as UserState)
            .disabled,
        }));
      }

      if (!isBlock) {
        const result = await dispatch(updateUser({ uid, disabled: false }));

        setCheckedUsers((state) => ({
          ...state,
          [(result.payload as UserState).uid]: (result.payload as UserState)
            .disabled,
        }));
      }
    }
  };

  const handleChecked = (user: UserState) => {
    setCheckedUsers((state) => {
      if (Object.keys(state).includes(user.uid)) {
        const newState = { ...state };
        delete newState[user.uid];
        return newState;
      }

      return { ...state, [user.uid]: user.disabled };
    });
  };

  return (
    <>
      <EnhancedTableToolbar
        numSelected={checked.length}
        handleDeleteUsers={handleDeleteUsers}
        handleBlockedUsers={handleBlockedUsers}
        checkedUsers={checkedUsers}
      />

      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    checked.length < users.length && checked.length > 0
                  }
                  checked={
                    checked.length === users.length && checked.length > 0
                  }
                  color="primary"
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                  onClick={() => {
                    if (checked.length === users.length) {
                      setCheckedUsers({});
                    } else {
                      const checkedUsersObject = users.reduce(
                        (acc, user) => {
                          acc[user.uid] = user.disabled;
                          return acc;
                        },
                        {} as { [key: string]: boolean }
                      );
                      setCheckedUsers(checkedUsersObject);
                    }
                  }}
                />
              </TableCell>
              {HEADER_TABLE.map((title, index) => (
                <TableCell
                  key={index + title}
                  align={'center'}
                  padding={'normal'}
                  sortDirection={false}
                >
                  <TableSortLabel
                    active={index === sort.index}
                    direction={index === sort.index ? sort.order : 'asc'}
                    onClick={() => {
                      handleSort(index);
                    }}
                  >
                    {title}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.uid}
                role="checkbox"
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="error"
                    checked={checked.includes(user.uid)}
                    onClick={() => handleChecked(user)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.displayName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.email}
                </TableCell>
                <TableCell align="center">
                  {user.metadata.lastSignInTime}
                </TableCell>
                <TableCell align="left">
                  {user.disabled ? 'Blocked' : 'Active'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
