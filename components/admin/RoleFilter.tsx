import styled from "@emotion/styled";
import { Chip } from "@mui/material";
import { roleFilterState, Key } from "@store/admin/roleFilterState";
import { useRecoilState } from "recoil";

const RoleFilter = () => {
  const [{ admin, seller, buyer }, setRoleFilterState] =
    useRecoilState(roleFilterState);
  const onChangeFilter = (e: any) => {
    const textContent: Key = e.target.textContent;
    setRoleFilterState((state) => ({
      ...state,
      [textContent]: !state[textContent],
    }));
  };
  return (
    <Box>
      <Chip
        label="admin"
        variant={admin ? "filled" : "outlined"}
        onClick={onChangeFilter}
        className="filterChip"
      />
      <Chip
        label="seller"
        variant={seller ? "filled" : "outlined"}
        onClick={onChangeFilter}
        className="filterChip"
      />
      <Chip
        label="buyer"
        variant={buyer ? "filled" : "outlined"}
        onClick={onChangeFilter}
        className="filterChip"
      />
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

export default RoleFilter;
