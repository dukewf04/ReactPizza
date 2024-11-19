import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSort } from '../redux/slices/filterSlice';

export const sortList = [
  { name: 'популярности', sortProperty: 'rating' },
  { name: 'цене', sortProperty: 'price' },
  { name: 'алфавиту', sortProperty: 'title' },
];

const Sort = memo(({ sort }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const sortRef = useRef();

  const onClickListItem = (obj) => {
    dispatch(setSort(obj));
    setOpen(false);
  };

  // Закрытие sort при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.body.addEventListener('click', handleClickOutside);

    return () => document.body.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={sortRef} className="sort">
      <div className="sort__label">
        {!sort.order || sort.order === 'asc' ? (
          <svg
            onClick={() => onClickListItem({ ...sort, order: 'desc' })}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z" />
          </svg>
        ) : (
          <svg
            onClick={() => onClickListItem({ ...sort, order: 'asc' })}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 1C0 0.83073 0.061849 0.68424 0.185547 0.56055L4.56055 5.81445C4.68424 5.93815 4.83073 6 5 6C5.16927 6 5.31576 5.93815 5.43945 5.81445L9.81445 0.56055C9.93815 0.68424 10 0.83073 10 1C10 1.16927 9.93815 1.31576 9.81445 1.43945C9.69075 1.56315 9.54427 1.625 9.375 1.625H0.625C0.455729 1.625 0.309245 1.56315 0.185547 1.43945C0.061849 1.31576 0 1.16927 0 1Z" />
          </svg>
        )}
        <b>Сортировка по:</b>
        <span onClick={() => setOpen(!open)}>{sort.name}</span>
      </div>
      {open && (
        <div className="sort__popup">
          <ul>
            {sortList.map((obj, i) => (
              <li
                key={i}
                onClick={() => onClickListItem(obj)}
                className={sort.sortProperty === obj.sortProperty ? 'active' : ''}
              >
                {obj.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default Sort;
