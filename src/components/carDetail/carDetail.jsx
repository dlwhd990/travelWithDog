import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "../loadingPage/loadingPage";
import styles from "./carDetail.module.css";

const CarDetail = (props) => {
  const { carId, businessId, pickupDateTime, dropoffDateTime } = useParams();
  const [carInfo, setCarInfo] = useState(null);
  const [korPickupDateTime, setKorPickupDateTime] = useState(null);
  const [korDropoffDateTime, setKorDropoffDateTime] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [count, setCount] = useState({
    personCount: 1,
    dogCount: 1,
  });
  const [basePrice, setBasePrice] = useState();
  const [finalPrice, setFinalPrice] = useState();

  const { personCount, dogCount } = count;

  const loadCarInfo = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASEURL}/rentcars/${carId}/${businessId}?pickup_datetime=${pickupDateTime}&dropoff_datetime=${dropoffDateTime}`
      )
      .then((response) => setCarInfo(response.data))
      .catch((err) => console.error(err));
  };

  //영문 요일을 한글로 바꾸어 줌
  const dayTranslator = (selectedDay) => {
    const dayList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const korDayList = ["월", "화", "수", "목", "금", "토", "일"];
    for (let i = 0; i < dayList.length; i++) {
      if (dayList[i] === selectedDay) {
        return korDayList[i];
      }
    }
  };

  const onInsuranceSelectHandler = (e) => {
    carInfo.insurances.forEach((ins) => {
      if (ins.name === e.currentTarget.dataset.name) {
        setSelectedInsurance(ins);
        return false;
      }
    });
  };

  const onCountChangeHandler = (e) => {
    const { name, value } = e.target;
    setCount({
      ...count,
      [name]: Number(value),
    });
  };

  //렌트카 정보 불러오기
  useEffect(() => {
    window.scrollTo({ top: 0 });
    loadCarInfo();
  }, []);

  //uri parameter에 따라 렌트카 검색 부분 날짜와 시간 초기설정
  useEffect(() => {
    const makeDateTimeToKorString = () => {
      const p = pickupDateTime;
      const d = dropoffDateTime;
      const pDate = new Date(p.slice(0, 10));
      const dDate = new Date(d.slice(0, 10));

      const pResult = `${p.slice(0, 4)}년 ${parseInt(
        p.slice(5, 7)
      )}월 ${parseInt(p.slice(8, 10))}일 (${dayTranslator(
        pDate.toString().split(" ")[0]
      )}) ${p.slice(11)}`;

      const dResult = `${d.slice(0, 4)}년 ${parseInt(
        d.slice(5, 7)
      )}월 ${parseInt(d.slice(8, 10))}일 (${dayTranslator(
        dDate.toString().split(" ")[0]
      )}) ${d.slice(11)}`;
      setKorPickupDateTime(pResult);
      setKorDropoffDateTime(dResult);
      setTotalTime((Date.parse(d) - Date.parse(p)) / 3600000);
    };
    makeDateTimeToKorString();
  }, []);

  //렌터카 정보 받아왔으면 첫 보험을 자동 선택
  useEffect(() => {
    if (!carInfo) {
      return;
    }
    setSelectedInsurance(carInfo.insurances[0]);
  }, [carInfo]);

  // 보험 선택 변경될 때 마다 base price 변경
  useEffect(() => {
    if (!selectedInsurance) {
      return;
    }
    setBasePrice(selectedInsurance.price);
  }, [selectedInsurance]);

  //base price 또는 반려견 수 변경될 때 마다 반려견 수에 맞추어 base price + 추가요금 = final price 설정
  useEffect(() => {
    if (!basePrice) {
      return;
    }
    console.log(basePrice);
    //finalPrice 반려견수로 추가요금 계산 로직
    setFinalPrice(basePrice + 30000 * (dogCount - 1));
  }, [basePrice, dogCount]);

  return (
    <>
      {carInfo ? (
        <div className={styles.body}>
          <div className={styles.container}>
            <main className={styles.main}>
              <div className={styles.top}>
                <p className={styles.top_title}>렌터카 예약</p>
                <div className={styles.top_data_container}>
                  <div className={styles.image_container}>
                    <img
                      src={
                        carInfo.images.length > 0
                          ? carInfo.images[0].url
                          : "/travelWithDog/images/no_image.jpeg"
                      }
                      alt="car_image"
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.top_text_data_container}>
                    <div className={styles.top_name_container}>
                      <p className={styles.name}>{carInfo.name}</p>
                      <p
                        className={styles.type}
                      >{`${carInfo.seat_count}인승 ${carInfo.rentcar_class_code.name}`}</p>
                    </div>
                    <div className={styles.top_option_container}>
                      {carInfo.specifications.map((spe) => (
                        <div key={spe} className={styles.top_option}>
                          <i
                            className={`${styles.check_icon} fas fa-check`}
                          ></i>
                          <p className={styles.option_name}>{spe}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.part}>
                <h2 className={styles.part_title}>대여 기간</h2>
                <div className={styles.range_container}>
                  <div className={styles.range_item}>
                    <p className={styles.range_text}>대여 일시</p>
                    <p className={styles.range}>{korPickupDateTime}</p>
                  </div>
                  <div className={styles.range_item}>
                    <p className={styles.range_text}>반납 일시</p>
                    <p className={styles.range}>{korDropoffDateTime}</p>
                  </div>
                  <div className={styles.range_item_right}>
                    <p className={styles.range_text}>대여 시간</p>
                    <p className={styles.range}>{totalTime}시간</p>
                  </div>
                </div>
              </div>

              <div className={styles.part}>
                <h2 className={styles.part_title}>보험 선택</h2>
                <div className={styles.insurance_container}>
                  {carInfo.insurances.map((ins) => (
                    <div
                      key={ins.id}
                      className={`${
                        selectedInsurance && selectedInsurance.name === ins.name
                          ? `${styles.insurance_item} ${styles.insurance_on}`
                          : `${styles.insurance_item}`
                      }`}
                      onClick={onInsuranceSelectHandler}
                      data-name={ins.name}
                    >
                      <div className={styles.insurance_checkbox_container}>
                        <input
                          type="checkbox"
                          checked={
                            selectedInsurance &&
                            selectedInsurance.name === ins.name
                              ? true
                              : false
                          }
                          className={styles.insurance_checkbox}
                        />
                      </div>
                      <p className={styles.insurance_name}>{ins.name}</p>
                      <div className={styles.insurance_option_container}>
                        {ins.driver && (
                          <div className={styles.insurance_option}>
                            <p className={styles.insurance_option_name}>
                              운전자 조건
                            </p>
                            <p className={styles.insurance_option_desc}>
                              {ins.driver}
                            </p>
                          </div>
                        )}
                        {ins.excess && (
                          <div className={styles.insurance_option}>
                            <p className={styles.insurance_option_name}>
                              면책 금액
                            </p>
                            <p className={styles.insurance_option_desc}>
                              {ins.excess}
                            </p>
                          </div>
                        )}
                        {ins.coverage && (
                          <div className={styles.insurance_option}>
                            <p className={styles.insurance_option_name}>
                              보상 한도
                            </p>
                            <p className={styles.insurance_option_desc}>
                              {ins.coverage}
                            </p>
                          </div>
                        )}
                        {ins.liability && (
                          <div className={styles.insurance_option}>
                            <p className={styles.insurance_option_name}>
                              자기부담금
                            </p>
                            <p className={styles.insurance_option_desc}>
                              {ins.liability}
                            </p>
                          </div>
                        )}
                      </div>
                      <p className={styles.price}>{`${ins.price.toLocaleString(
                        "ko-kr"
                      )}원`}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.part}>
                <h2 className={styles.part_title}>이용 규칙</h2>
                <div className={styles.note}>{carInfo.note}</div>
              </div>
              <div className={styles.bottom}>
                <h2 className={styles.part_title}>환불 규정</h2>
                <div className={styles.cancellation}>
                  {carInfo.cancellation}
                </div>
              </div>
            </main>
            <aside className={styles.side_menu}>
              <div className={styles.number_container}>
                <div className={styles.select_form}>
                  <p className={styles.select_title}>탑승 인원 (운전자 포함)</p>
                  <select
                    name="personCount"
                    value={personCount}
                    onChange={onCountChangeHandler}
                    className={styles.select}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className={styles.select_form}>
                  <p className={styles.select_title}>동반 반려견 수</p>
                  <select
                    name="dogCount"
                    value={dogCount}
                    onChange={onCountChangeHandler}
                    className={styles.select}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <p className={styles.warning}>
                  반려견 1마리 당 추가요금 3만원입니다.
                </p>
                {personCount + dogCount >= 5 && (
                  <div>
                    <p className={styles.warning}>
                      탑승인원과 반려견수가 많을 경우 미팅서비스의 제한이 있을
                      수 있습니다.
                    </p>
                  </div>
                )}
              </div>
              <div className={styles.side_menu_price_container}>
                <div className={styles.side_menu_price_item}>
                  <p className={styles.side_menu_price_text}>기본 요금</p>
                  <p className={styles.side_menu_price}>{`${
                    basePrice && basePrice.toLocaleString("ko-kr")
                  }원`}</p>
                </div>
                <div className={styles.side_menu_price_item_total}>
                  <p className={styles.side_menu_price_text}>총 요금</p>
                  <p className={styles.side_menu_price_total}>{`${
                    finalPrice && finalPrice.toLocaleString("ko-kr")
                  }원`}</p>
                </div>
              </div>
              <button className={styles.reservation_button}>예약하기</button>
            </aside>
          </div>
        </div>
      ) : (
        <div className={styles.loading}>
          <LoadingPage />
        </div>
      )}
    </>
  );
};

export default CarDetail;
