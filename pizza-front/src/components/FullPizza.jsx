import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FullPizza = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get('https://667328d16ca902ae11b34ed2.mockapi.io/items/' + id);
        setData(data);
      } catch (error) {
        alert('Ошибка при получении пиццы');
        navigate('/');
      }
    }

    fetchPizza();
  }, []);

  if (!data) {
    return 'Загрузка...';
  }

  return (
    <div className="container">
      <img src={data.image}></img>
      <h2>{data.title}</h2>
      <p>{data.price}</p>
    </div>
  );
};

export default FullPizza;
