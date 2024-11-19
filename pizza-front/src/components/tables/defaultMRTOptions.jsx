import { MRT_Localization_RU } from 'material-react-table/locales/ru';

// Описание общих свойств для таблиц MRT с применением фильтрации, сортировки, пагинации
export const getDefaultMRTOptions = () => ({
  enableStickyHeader: true,
  enableStickyFooter: true,
  localization: MRT_Localization_RU,
  enableFilterMatchHighlighting: true,
  enableGlobalFilter: true,
  enableColumnResizing: true,
  rowNumberDisplayMode: 'original',
  initialState: {
    showColumnFilters: true,
    isLoading: true,
    density: 'compact',
  },
  muiFilterCheckboxProps: {
    title: '',
  },
  muiFilterTextFieldProps: {
    placeholder: '',
  },
  muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 190px)' } },
  muiTablePaperProps: {
    sx: {
      height: '100%',
    },
  },
  createDisplayMode: 'modal',
  editDisplayMode: 'modal',
  enableEditing: true,
  getRowId: (row) => row.id,
  displayColumnDefOptions: {
    'mrt-row-actions': {
      header: 'Действия',
      size: 120,
    },
  },
});
