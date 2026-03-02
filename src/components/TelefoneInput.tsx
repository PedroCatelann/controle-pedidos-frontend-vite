import React, { useState, useCallback } from "react";
import { colors } from "@/styles/theme";
import { Form, Input } from "antd";
import styled from "styled-components";

const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  let formatted = "";

  if (cleaned.length > 0) {
    formatted += `(${cleaned.substring(0, 2)}`;
  }
  if (cleaned.length > 2) {
    formatted += `) ${cleaned.substring(2, 7)}`;
  }
  if (cleaned.length > 7) {
    formatted += `-${cleaned.substring(7, 11)}`;
  }
  if (cleaned.length >= 10 && cleaned.length <= 10) {
    formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      6
    )}-${cleaned.substring(6, 10)}`;
  }

  return formatted;
};

const Wrapper = styled.div`
  max-width: 400px;
`;

export const TelefoneInput: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(event.target.value);
      setPhoneNumber(formattedValue);
    },
    []
  );

  return (
    <Wrapper>
      <Form.Item label="Telefone" htmlFor="phone-input">
        <Input
          id="phone-input"
          type="tel"
          placeholder="(99) 99999-9999"
          required
          value={phoneNumber}
          onChange={handleChange}
          maxLength={15}
        />
      </Form.Item>
      <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: colors.neutral.textSecondary }}>
        Exemplo: (11) 98765-4321
      </p>
    </Wrapper>
  );
};
