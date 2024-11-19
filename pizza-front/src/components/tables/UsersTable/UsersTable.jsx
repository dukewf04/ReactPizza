import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';
import { Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDefaultMRTOptions } from '../defaultMRTOptions';
import { errorHandler, successHandler } from '../../../utils/alarmHandler';
import { BASE_URL } from '../../../config/global';

const defaultMRTOptions = getDefaultMRTOptions();

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'avatar',
        header: 'Аватар',
        size: 180,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              alt={row.original.title}
              width={100}
              height={100}
              src={row.original.avatar}
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />
          </Box>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Имя',
        size: 150,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 200,
      },
      {
        accessorKey: 'phone',
        header: 'Телефон',
        size: 150,
      },
      {
        accessorKey: 'birthday',
        header: 'День рождения',
        size: 150,
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'address',
        header: 'Адрес',
        size: 170,
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'card',
        header: 'Привязанные карты',
        size: 150,
      },
      {
        accessorKey: 'notifications',
        header: 'Уведомления',
        size: 180,
      },
      {
        accessorKey: 'role',
        header: 'Роль',
        size: 150,
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
    ],
    [],
  );

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}users`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        if (error) {
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Удаление пользователя из базы
  const deleteUser = async (user_id) => {
    setIsDeletingUser(true);
    axios
      .get(`${BASE_URL}user_delete?user_id=${Number(user_id)}`)
      .then((res) => {
        setUsers(users.filter((user) => user.user_id !== user_id));
        successHandler('Пользователь удален');
      })
      .catch((error) => {
        if (error) {
          errorHandler(error);
        }
      })
      .finally(() => {
        setIsDeletingUser(false);
      });
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Вы действительно хотите удалить этого пользователя?')) {
      deleteUser(row.original.user_id);
    }
  };

  const table = useMaterialReactTable({
    ...defaultMRTOptions,
    columns,
    data: users,
    rowCount: users.length,
    state: {
      isLoading,
      isSaving: isDeletingUser,
    },
    renderRowActions: ({ row, table }) => (
      <Box>
        <Tooltip title="Удалить пользователя">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default UsersTable;
