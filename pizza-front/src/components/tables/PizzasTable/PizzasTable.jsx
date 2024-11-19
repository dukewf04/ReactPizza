import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDefaultMRTOptions } from '../defaultMRTOptions';
import { errorHandler, successHandler } from '../../../utils/alarmHandler';
import { BASE_URL } from '../../../config/global';

const defaultMRTOptions = getDefaultMRTOptions();

const PizzasTable = () => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingPizza, setIsDeletingPizza] = useState(false);
  const [isSavingPizza, setIsSavingPizza] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'id',
        size: 100,
        enableEditing: false,
      },
      {
        accessorKey: 'image',
        header: 'Изображение',
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
              src={row.original.image}
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />
          </Box>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Название',
        size: 200,
      },
      {
        accessorKey: 'types',
        header: 'Типы теста',
        Cell: ({ row }) => JSON.stringify(row.original.types),
        size: 200,
        enableEditing: false,
      },
      {
        accessorKey: 'size',
        header: 'Размеры',
        Cell: ({ row }) => JSON.stringify(row.original.size),
        size: 150,
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'price',
        header: 'Цена',
        size: 150,
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'rating',
        header: 'Популярность',
        size: 170,
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'description',
        header: 'Описание',
        size: 150,
      },
      {
        accessorKey: 'pfc',
        header: 'Пищевая ценность',
        size: 180,
      },
      {
        accessorKey: 'wtf',
        header: 'Маркировка',
        size: 150,
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
    ],
    [],
  );

  // Получение данных по пиццам при открытии таблицы
  const fetchPizzas = async () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}all_pizzas`)
      .then((res) => {
        setPizzas(res.data.data);
      })
      .catch((error) => {
        if (error) {
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  // Создание новой пиццы
  const handleCreatePizza = async (values) => {
    const data = {};

    // Отправляем только те данные, которые изменили
    Object.keys(values.values).forEach((key) => {
      if (values.values[key] !== '') {
        data[key] = values.values[key];
      }
    });

    setIsSavingPizza(true);
    axios
      .post(`${BASE_URL}pizza`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        successHandler('Новая пицца успешно добавлена');
        fetchPizzas();
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setIsSavingPizza(false);
      });
  };

  // Редактирование пиццы
  const handleSavePizza = async (values) => {
    const data = { id: values.values['id'] };

    // Отправляем только те данные, которые изменили
    Object.keys(values.values).forEach((key) => {
      if (values.values[key] !== pizzas.find((pizza) => pizza['id'] === values.values['id'])[key]) {
        data[key] = values.values[key];
      }
    });

    // if (Object.keys(data).length === 1) {
    //   errorHandler('Данные по текущей пицце не изменены');
    //   return;
    // }

    setIsSavingPizza(true);
    axios
      .patch(`${BASE_URL}pizza`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        successHandler('Данные успешно отредактированы');
        fetchPizzas();
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setIsSavingPizza(false);
      });
  };

  // Удаление пиццы
  const deletePizza = async (id) => {
    setIsDeletingPizza(true);
    axios
      .delete(`${BASE_URL}pizza`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          pizza_id: id,
        },
      })
      .then((res) => {
        setPizzas(pizzas.filter((pizza) => pizza.id !== id));
        successHandler('Пицца удалена');
      })
      .catch((error) => {
        if (error) {
          errorHandler(error);
        }
      })
      .finally(() => {
        setIsDeletingPizza(false);
      });
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Вы действительно хотите удалить эту пиццу?')) {
      deletePizza(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    ...defaultMRTOptions,
    columns,
    data: pizzas,
    rowCount: pizzas.length,
    initialState: { ...defaultMRTOptions.initialState, columnVisibility: { id: false } },
    state: {
      isLoading,
      isSaving: isDeletingPizza || isSavingPizza,
    },
    onEditingRowSave: handleSavePizza,
    onCreatingRowSave: handleCreatePizza,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Редактировать данные">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Удалить пиццу">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Добавить новую пиццу
      </Button>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default PizzasTable;
