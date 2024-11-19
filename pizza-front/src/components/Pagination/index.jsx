import ReactPaginate from 'react-paginate';
import style from './Pagination.module.scss';
import { useSelector } from 'react-redux';

const PaginationPizza = ({ currentPate, onChangePage }) => {
  const { count } = useSelector((state) => state.pizza);

  return (
    <ReactPaginate
      className={style.root}
      breakLabel="..."
      nextLabel=">"
      onPageChange={(e) => {
        onChangePage(e.selected + 1);
      }}
      pageRangeDisplayed={4}
      pageCount={Math.ceil(count / 8)}
      previousLabel="<"
      forcePage={currentPate - 1}
      renderOnZeroPageCount={null}
    />
  );
};

export default PaginationPizza;
