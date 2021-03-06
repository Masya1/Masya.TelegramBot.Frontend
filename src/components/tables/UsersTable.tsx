import {
  Avatar,
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  useTheme,
} from '@material-ui/core';
import { Remove, Edit, Create } from '@material-ui/icons';
import {
  DataGrid,
  GridCellParams,
  GridColumnHeaderParams,
  GridColumns,
  GridEditRowsModel,
  GridInputSelectionModel,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import React, { useCallback, useState } from 'react';
import { useAuth, useUsers } from '../../hooks';
import { base64ToSrc } from '../../utils';
import { Bool, TelegramUsername } from '..';
import { UserView, Permission } from '../../models';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';

export interface UsersTableProps {
  users: UserView[];
  onBlockClick: (id: number, isBlocked: boolean) => void;
  updateUser: (user: Partial<UserView>) => void;
  removeUser: (id: number) => void;
  loading?: boolean;
}

export const RenderAvatar = (params: GridRenderCellParams) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {params.value ? (
        <Avatar src={base64ToSrc(params.value as string)} alt="user avatar" />
      ) : (
        <Remove />
      )}
    </div>
  );
};

const RenderEmptyString = (params: GridRenderCellParams) => {
  return (
    params.value || (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Remove />
      </div>
    )
  );
};

const RenderAgency = (params: GridRenderCellParams) => {
  const { agencies } = useSelector((state: RootState) => state.agencies);
  const agencyId = params.value as number;
  const { updateUser } = useUsers();

  return (
    <Select
      autoWidth
      value={agencyId}
      IconComponent={Create}
      disableUnderline
      onChange={(e) =>
        updateUser({
          id: params.id as number,
          agencyId: e.target.value as number,
        })
      }>
      {agencies && agencies.length > 0 ? (
        agencies?.map((a) => (
          <MenuItem value={a.id} key={a.id}>
            {a.name}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="">Select agency</MenuItem>
      )}
    </Select>
  );
};

const RenderPermission = (params: GridRenderCellParams) => {
  const permission = params.value as Permission;
  const { updateUser } = useUsers();

  return (
    <Select
      autoWidth
      value={permission}
      IconComponent={Create}
      disableUnderline
      onChange={(e) =>
        updateUser({
          id: params.id as number,
          permission: e.target.value as Permission,
        })
      }
      disabled={params.value == Permission.SuperAdmin}>
      <MenuItem value={Permission.Guest} key={1}>
        Guest
      </MenuItem>
      <MenuItem value={Permission.User} key={2}>
        User
      </MenuItem>
      <MenuItem value={Permission.Agent} key={3}>
        Agent
      </MenuItem>
      <MenuItem value={Permission.Admin} key={4}>
        Admin
      </MenuItem>
      <MenuItem value={Permission.SuperAdmin} disabled key={5}>
        Super admin
      </MenuItem>
    </Select>
  );
};

const RenderBool = (params: GridRenderCellParams) => {
  const boolVal = params.value as boolean;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Bool value={boolVal} />
    </div>
  );
};

const RenderBlockButton = (params: GridRenderCellParams) => {
  const isBlocked = params.value as boolean;

  return (
    <Button
      color={isBlocked ? 'primary' : 'secondary'}
      fullWidth
      variant="contained"
      disabled={params.row.permission == Permission.SuperAdmin}>
      {isBlocked ? 'Unblock' : 'Block'}
    </Button>
  );
};

const RenderEditableHeader = (params: GridColumnHeaderParams) => {
  return (
    <>
      {params.colDef.headerName}
      <Edit fontSize="small" color="primary" />
    </>
  );
};

const RenderTelegramuUsername = (params: GridRenderCellParams) => {
  return <TelegramUsername username={params.value as string} />;
};

const columns: GridColumns = [
  {
    field: 'id',
    headerName: 'Id',
    width: 90,
    headerAlign: 'right',
    align: 'right',
    hide: true,
  },
  {
    field: 'agencyId',
    headerName: 'Agency',
    width: 150,
    renderCell: RenderAgency,
    renderHeader: RenderEditableHeader,
    editable: false,
  },
  {
    field: 'permission',
    headerName: 'Permission',
    width: 160,
    renderCell: RenderPermission,
    renderHeader: RenderEditableHeader,
    editable: false,
  },
  { field: 'telegramAccountId', headerName: 'Telegram Id', width: 180 },
  {
    field: 'telegramLogin',
    headerName: 'Telegram Login',
    width: 180,
    renderCell: RenderTelegramuUsername,
  },
  {
    field: 'telegramAvatar',
    headerName: 'Avatar',
    sortable: false,
    filterable: false,
    renderCell: RenderAvatar,
  },
  { field: 'telegramFirstName', headerName: 'First Name', width: 150 },
  {
    field: 'telegramLastName',
    headerName: 'Last Name',
    width: 150,
    renderCell: RenderEmptyString,
  },
  { field: 'telegramPhoneNumber', headerName: 'Phone', width: 150 },
  {
    field: 'lastCalledAt',
    headerName: 'Last Update',
    width: 150,
    renderCell: RenderEmptyString,
  },
  {
    field: 'isBlocked',
    headerName: 'Blocked',
    width: 150,
    renderCell: RenderBlockButton,
    renderHeader: RenderEditableHeader,
  },
  {
    field: 'blockReason',
    headerName: 'Block Reason',
    width: 200,
    renderCell: RenderEmptyString,
    renderHeader: RenderEditableHeader,
  },
  {
    field: 'isBlockedByBot',
    headerName: 'Blocked By Bot',
    width: 200,
    renderCell: RenderBool,
  },
  {
    field: 'isIgnored',
    headerName: 'Ignored',
    width: 150,
    renderCell: RenderBool,
  },
  {
    field: 'note',
    headerName: 'Note',
    width: 150,
    renderCell: RenderEmptyString,
    editable: true,
    renderHeader: RenderEditableHeader,
  },
];

export const UsersTable: React.FC<UsersTableProps> = (props) => {
  const { users, onBlockClick, updateUser, removeUser, loading } = props;
  const { account } = useAuth();
  const [editModel, setEditModel] = useState<GridEditRowsModel | undefined>();
  const [selectionModel, setSelectionModel] = useState<
    GridInputSelectionModel | undefined
  >();
  const theme = useTheme();

  const onCellClick = useCallback(
    (params: GridCellParams) => {
      if (params.field != 'isBlocked') return;
      if (params.row.permission == Permission.SuperAdmin) return;
      onBlockClick(params.id as number, params.value as boolean);
    },
    [onBlockClick],
  );

  const onRowEdit = (model: GridEditRowsModel) => {
    setEditModel(model);
    for (const changeId in model) {
      const userChanges = model[changeId];
      for (const change in userChanges) {
        updateUser({
          id: Number(changeId),
          [change]: userChanges[change].value,
        });
      }
    }
  };

  const onSelectionModelChange = (model: GridInputSelectionModel) => {
    setSelectionModel(model);
  };

  const onRemoveClick = () => {
    if (!selectionModel) {
      return;
    }

    const model = selectionModel as Array<number>;

    for (const id of model) {
      removeUser(id);
    }
    setSelectionModel([]);
  };

  return (
    <Paper>
      <DataGrid
        columns={columns}
        rows={users}
        pageSize={10}
        rowsPerPageOptions={[10]}
        autoHeight
        checkboxSelection
        disableSelectionOnClick
        onCellClick={onCellClick}
        editRowsModel={editModel}
        onEditRowsModelChange={onRowEdit}
        isRowSelectable={(params) => account.user?.id !== (params.id as number)}
        selectionModel={selectionModel}
        onSelectionModelChange={onSelectionModelChange}
        loading={loading}
        columnBuffer={10}
      />
      <Box
        style={{
          display:
            (selectionModel as Array<number>) &&
            (selectionModel as Array<number>).length > 0
              ? 'block'
              : 'none',
          padding: theme.spacing(2),
        }}>
        <Button
          style={{
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          }}
          variant="contained"
          onClick={onRemoveClick}>
          Delete selected user(s)
        </Button>
      </Box>
    </Paper>
  );
};
