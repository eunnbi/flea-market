import styled from '@emotion/styled';
import { Chip } from '@mui/material';

interface Props {
  roleFilter: {
    admin: boolean;
    seller: boolean;
    buyer: boolean;
  };
  onChangeFilter: (e: any) => void;
}

const Filter = ({ roleFilter, onChangeFilter }: Props) => {
  const { admin, seller, buyer } = roleFilter;
  return (
    <Box>
      <Chip label="admin" variant={admin ? 'filled' : 'outlined'} onClick={onChangeFilter} className="filterChip" />
      <Chip label="seller" variant={seller ? 'filled' : 'outlined'} onClick={onChangeFilter} className="filterChip" />
      <Chip label="buyer" variant={buyer ? 'filled' : 'outlined'} onClick={onChangeFilter} className="filterChip" />
    </Box>
  );
};

const Box = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  span {
    text-transform: capitalize;
  }
`;

export default Filter;
