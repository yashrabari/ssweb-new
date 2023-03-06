import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const BackContainer = styled.div`
  width: 64px;
  height: 55px;
  font-family: "TT Commons";
  font-style: normal;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
  position: ${(props) => props.position ?? "absolute"};
  ${(props) =>
    props.position &&
    `
  top: 50px;
  left: 250px;
  `}
  border-radius: 10px;
  cursor: pointer;
  background: #ffffff;
  box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.12);
  border-radius: 15px;
  cursor: pointer;
  font-weight: ${(props) => props.fontWeight ?? "600"};

  @media (max-width: 768px) {
    height: 40px;
    width: 40px;
  }
`;

export default function BackTransactions() {
  const navigate = useNavigate();

  return (
    <BackContainer onClick={() => navigate(-1)}>
      <svg
        width={25}
        height={25}
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.07 6.43005L4 12.5001L10.07 18.5701M21 12.5001H4.17"
          stroke="#00A652"
          strokeWidth="1.5"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BackContainer>
  );
}
