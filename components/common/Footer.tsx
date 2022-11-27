import styled from '@emotion/styled';

const Footer = () => {
  return (
    <FooterBox>
      <p>Flea Market &copy; 2022</p>
    </FooterBox>
  );
};

const FooterBox = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    padding: 1.5rem;
  }
`;

export default Footer;
