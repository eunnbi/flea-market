import { Chip } from "@mui/material";
import { roleFilterState, Key } from "@store/admin/roleFilterState";
import React, { MouseEventHandler, useCallback } from "react";
import { useRecoilState } from "recoil";

const RoleFilter = () => {
  const [{ admin, seller, buyer }, setRoleFilterState] =
    useRecoilState(roleFilterState);
  const onChangeFilter: MouseEventHandler<HTMLDivElement> = useCallback(
    (e: any) => {
      const textContent: Key = e.target.textContent;
      setRoleFilterState((state) => ({
        ...state,
        [textContent]: !state[textContent],
      }));
    },
    []
  );
  return (
    <div className="flex items-center gap-4 capitalize">
      <FilterButton
        label="admin"
        selected={admin ? true : false}
        onChange={onChangeFilter}
      />
      <FilterButton
        label="buyer"
        selected={buyer ? true : false}
        onChange={onChangeFilter}
      />
      <FilterButton
        label="seller"
        selected={seller ? true : false}
        onChange={onChangeFilter}
      />
    </div>
  );
};

interface Props {
  label: string;
  selected: boolean;
  onChange: MouseEventHandler<HTMLDivElement>;
}

// eslint-disable-next-line react/display-name
const FilterButton = React.memo(({ label, selected, onChange }: Props) => {
  return (
    <Chip
      label={label}
      variant={selected ? "filled" : "outlined"}
      onClick={onChange}
      className="filterChip"
    />
  );
});

export default RoleFilter;
