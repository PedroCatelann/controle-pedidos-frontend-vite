import styled from "styled-components";

const Container = styled.div`
  padding: 1rem;
`;

export default function DashboardPage() {
  return (
    <Container>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao sistema</p>
    </Container>
  );
}
