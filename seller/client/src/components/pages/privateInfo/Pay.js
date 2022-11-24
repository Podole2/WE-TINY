import React from "react";
import "../../css/pages/Pay.css";
import DummyImg from "../../images/dummyImg02.png";

function Pay() {
  return (
    <div className="payContent-wrap">
      <div className="payContent-left">
        <div className="shipment-title">
          <h2>배송정보</h2>
          <button type="button">배송지목록</button>
        </div>

        <div className="shipment-info">
          <div className="ship-radio">
            <input type="radio" value="기본배송지" checked />
            <span>기본배송지</span>
            <input type="radio" value="최근배송지" />
            <span>최근배송지</span>
            <input type="radio" value="직접입력" />
            <span>직접입력</span>
          </div>
          <div className="ship-privateInfo">
            <div className="ship-name">
              <h3>박현영</h3>
            </div>
            <div className="ship-address">
              <span>
                (18394) 경기도 화성시 동탄지성로 319-19 (기산동,에스케이뷰파크
                3차) 신동탄 sk뷰파크3차 109동402호
              </span>
            </div>
            <div className="ship-phone">010-6436-4837</div>
          </div>

          <div className="phone-option">
            <input type="checkbox" value="안심번호 사용" />
            <span>안심번호 사용</span>
            <input type="checkbox" value="연락처 추가" />
            <span>연락처 추가</span>
          </div>
          <div className="ship-option">
            <select name="ship-option">
              <option value="">배송시 요청사항 선택하기</option>
              <option value="1">문앞에 놔주세요.</option>
              <option value="2">경비실에 맡겨주세요.</option>
              <option value="3">배송 전 휴대폰으로 연락주세요.</option>
              <option value="4">직접 수령할게요.</option>
              <option value="5">직접 입력하기</option>
            </select>
          </div>
        </div>

        <div className="product-title">
          <h2>주문상품</h2>
          <span>
            상품수량 및 옵션변경은 상품상세 또는 장바구니에서 가능합니다.
          </span>
        </div>
        <div className="product-info">
          <table>
            <tr>
              <td>이미지</td>
              <td>상품명</td>
              <td>수량</td>
              <td>가격</td>
              <td>배송비</td>
            </tr>
            <tr>
              <td>
                <img
                  src={DummyImg}
                  style={{ width: "120px", height: "120px" }}
                />
              </td>
              <td>상품이름상품이름상품이름철수</td>
              <td>1개</td>
              <td>49,000원</td>
              <td>3,000원</td>
            </tr>
          </table>
        </div>
      </div>
      <div className="payContent-right">
        <div className="pay-title">
          <h2>결제정보</h2>
        </div>
        <div className="point">
          <h3>적립혜택</h3>
          <span>
            적립예정 <b>3,000</b>P
          </span>
        </div>
        <div className="payment">
          <div className="pay-price-title">
            <h3>결제 예정금액</h3>
          </div>
          <div className="product-price">
            <span>상품금액</span>
            <span>
              <b>769,900</b>원
            </span>
          </div>
          <div className="ship-fee">
            <span>배송비</span>
            <span>
              <b>3,000</b>원
            </span>
          </div>
          <div className="discount">
            <span>할인금액</span>
            <span className="discount-price">
              <b>0</b>원
            </span>
          </div>
          <div className="total-price">
            <span>합계</span>
            <span className="total">
              <b>769,900</b>원
            </span>
          </div>
        </div>
        <div className="pay-btn-wrap">
          <p>정보제공, 필수약관 확인 후 결제에 동의합니다.</p>
          <div className="pay-btn">
            <input type="submit" value="769,900원 결제하기" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pay;
