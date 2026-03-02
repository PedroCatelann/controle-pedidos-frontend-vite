import React from "react";
import { Spin } from "antd";
import styled from "styled-components";

interface CustomSpinnerProps {
  color?: string;
  size?: string;
  thickness?: string;
  isLoading: boolean;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const CustomSpinner: React.FC<CustomSpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <Overlay>
      <Spin size="large" />
    </Overlay>
  );
};

export default CustomSpinner;
