import style from './NotFoundBlock.module.scss';

const NotFoundBlock = () => {
  return (
    <div className={style.root}>
      <h1>
        Ничего не найдено <span>☹️</span>
      </h1>
      <p className={style.description}>Данной страницы не существует</p>
    </div>
  );
};

export default NotFoundBlock;
