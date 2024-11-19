import { useCallback, useEffect } from 'react';
import Categories, { categories } from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import PaginationPizza from '../components/Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice';
import { fetchPizzas } from '../redux/slices/pizzaSlice';

const Home = () => {
  const dispatch = useDispatch();

  const { categoryId, sort, currentPage, searchValue } = useSelector((state) => state.filter);
  const { items, status } = useSelector((state) => state.pizza);
  const sortType = sort.sortProperty;

  const onChangeCategory = useCallback((id) => {
    dispatch(setCurrentPage(1));
    dispatch(setCategoryId(id));
  }, []);

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  const getPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';
    const order = !sort.order ? 'asc' : sort.order;

    dispatch(
      fetchPizzas({
        category,
        search,
        order,
        currentPage,
        sortType,
      }),
    );
  };

  useEffect(() => {
    getPizzas();
  }, [categoryId, sort, currentPage, searchValue]);

  const pizzas = items?.map((obj, i) => <PizzaBlock key={i} {...obj} />) || [];
  const skeletons = [...new Array(6)].map((_, i) => <Skeleton key={i} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort sort={sort} />
      </div>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😟</h2>
          <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <>
          <h2 className="content__title">{categories[categoryId]}</h2>
          <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
        </>
      )}
      <PaginationPizza currentPate={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
