import Carousel from 'react-bootstrap/Carousel';

const CarouselPizza = () => {
  const imageArray = Array.from({ length: 5 }, (_, i) => i);

  return (
    <Carousel wrap={true} className="mb-5">
      {imageArray.map((image) => (
        <Carousel.Item key={image}>
          <img className="d-block w-100" src={`carousel/${image + 1}.webp`} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselPizza;
