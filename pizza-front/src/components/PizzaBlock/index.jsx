import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../redux/slices/cartSlice';
import { selectCartItemById } from '../../redux/slices/pizzaSlice';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function PizzaBlock({ id, title, price, image, size, types, description, pfc, wtf }) {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItemById(id));
  const [activeType, setActiveType] = useState(types[0]);
  const [activeSize, setActiveSize] = useState(0);
  const addedCount = cartItem ? cartItem.count : 0;

  // Цена пиццы разная в зависимости от размера
  const handleChangePrice = () => {
    return Math.floor(price * (1 + (5 * (size[activeSize] - Math.min(...size))) / 100));
  };

  const onClickAdd = () => {
    const item = {
      id: `${id}-${activeType}-${size[activeSize]}`,
      title,
      price: handleChangePrice(),
      image,
      type: activeType,
      size: activeSize,
      count: 0,
      size: size[activeSize],
    };
    dispatch(addItem(item));
  };

  return (
    <div className="pizza-block-wrapper">
      <div className="pizza-block">
        <div className="pizza-block__imageContainer">
          <img className="pizza-block__image" src={image} alt={title} />
        </div>
        <div className="pizza-block__content">
          <div className="pizza-block__content__first">
            <div className="pizza-block__info" role="button" tabIndex="0">
              {wtf && <span className="pizza-block__info__wtf">{wtf}</span>}

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{<pre className="pizza-block__info__pfc">{pfc}</pre>}</Tooltip>}
              >
                <span className="pizza-block__info__ingredients">
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                    className="_3RgSpktyKSkdw9AgorEDVk"
                  >
                    <path
                      d="M9 18A9 9 0 119 0a9 9 0 010 18zm0-1A8 8 0 109 1a8 8 0 000 16zM8 4h2v2H8V4zm0 4h2v6H8V8z"
                      fill="currentColor"
                      fillRule="nonzero"
                    ></path>
                  </svg>
                </span>
              </OverlayTrigger>
            </div>

            <h4 className="pizza-block__title">{title}</h4>

            <div className="pizza-block__description">{description}</div>
          </div>

          <div className="pizza-block__content__second">
            {' '}
            <div className="pizza-block__selector">
              <ul>
                {types.map((item) => (
                  <li
                    key={item}
                    onClick={() => setActiveType(item)}
                    className={activeType === item ? 'active' : ''}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <ul>
                {size.map((size, i) => (
                  <li
                    key={i}
                    onClick={() => setActiveSize(i)}
                    className={activeSize === i ? 'active' : ''}
                  >
                    {size} см.
                  </li>
                ))}
              </ul>
            </div>
            <div className="pizza-block__bottom">
              <div className="pizza-block__price">{handleChangePrice()} ₽</div>
              <button onClick={onClickAdd} className="button button--outline button--add">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                    fill="white"
                  />
                </svg>
                <span>Добавить</span>
                {addedCount > 0 && <i>{addedCount}</i>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaBlock;
