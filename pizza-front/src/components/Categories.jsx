import React, { memo } from 'react';

export const categories = ['Все', 'Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];

const Categories = memo(({ value, onChangeCategory }) => {

  return (
    <div className="categories">
      <ul>
        {categories.map((categoryName, index) => (
          <li
            key={index}
            onClick={() => onChangeCategory(index)}
            className={value === index ? 'active' : ''}>
            {categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
})

export default Categories;
