import { Login, PersonAddAlt1 } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import UsersTable from 'src/components/UsersTable/UsersTable';
import { useAppSelector } from 'src/hooks/redux';
import { useText } from 'src/hooks/useText';
import { getUser } from 'src/store/slice/user.slice';

export default function MainPage() {
  const { isAuth, email, displayName } = useAppSelector(getUser);
  const T = useText();

  return (
    <Box
      sx={{
        padding: {
          xs: 2,
          lg: 0,
        },
      }}
    >
      {!isAuth && (
        <Box maxWidth={520} my={3} mx="auto">
          <Typography textAlign="center" mb={2}>
            {T.HI}
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={1}>
            <Button
              component={NavLink}
              sx={{ px: '15px' }}
              to="/signin"
              variant={location.pathname === '/signin' ? 'outlined' : 'text'}
              endIcon={<Login />}
            >
              {T.SIGNIN}
            </Button>
            <Button
              component={NavLink}
              sx={{ px: '15px' }}
              to="/signup"
              variant={location.pathname === '/signup' ? 'outlined' : 'text'}
              endIcon={<PersonAddAlt1 />}
            >
              {T.SIGNUP}
            </Button>
          </Stack>
        </Box>
      )}
      {isAuth && (
        <>
          <Box maxWidth={520} my={3} mx="auto">
            {`${T.HELLO}, ${displayName || email || 'Username'}`}
          </Box>
          <UsersTable />
        </>
      )}
    </Box>
  );
}
