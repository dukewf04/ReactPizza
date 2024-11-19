import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <MDBFooter className="text-center text-lg-start text-muted">
      <section className="d-flex justify-content-lg-end p-4 border-top">
        <div>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="twitter" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="vk" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="instagram" />
          </a>
        </div>
      </section>

      <section className="">
        <MDBContainer className="text-center text-md-start mt-3">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                Crazy pizza
              </h6>
              <p>
                Crazy Pizza - это именно то, что вам нужно! Мы предлагаем самые безумные и вкусные
                пиццы в городе.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Работа</h6>
              <p>
                <a href="#!" className="text-reset">
                  В пиццерии
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Это интересно</h6>
              <p>
                <a href="#!" className="text-reset">
                  Экскурсии и мастер-классы
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Корпоративные заказы
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Почему мы готовим без перчаток?
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Контакты</h6>
              <p>
                <MDBIcon icon="home" className="me-3" /> Пермь, 614000, RU
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" /> info@crazypizza.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> + 01 234 567 88
              </p>
              <p>
                <MDBIcon icon="print" className="me-3" /> + 01 234 567 89
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className="text-center pb-4">
        © 2024 Copyright: &nbsp;
        <a className="text-reset fw-bold" href="#!">
          crazypizza.com
        </a>
      </div>
    </MDBFooter>
  );
}
