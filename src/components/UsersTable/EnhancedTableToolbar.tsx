import { Toolbar, alpha, Typography, Tooltip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export function EnhancedTableToolbar(props: {
  numSelected: number;
  handleDeleteUsers: () => void;
  handleBlockedUsers: (isBlock: boolean) => void;
  checkedUsers: {
    [key: string]: boolean;
  };
}) {
  const { numSelected, handleDeleteUsers, handleBlockedUsers, checkedUsers } =
    props;

  const checkBlock =
    Object.values(checkedUsers).filter((val) => val).length === numSelected
      ? 'LockOpen'
      : 'LockClosed';

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Admin panel
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          {checkBlock === 'LockClosed' ? (
            <Tooltip title="Blocked" onClick={() => handleBlockedUsers(true)}>
              <IconButton>
                <LockPersonIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Open" onClick={() => handleBlockedUsers(false)}>
              <IconButton>
                <LockOpenIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Delete" onClick={handleDeleteUsers}>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
