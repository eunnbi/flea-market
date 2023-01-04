import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import { User } from "@prisma/client";
import { styled } from "@mui/material/styles";
import { IoMdTrash } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { tableCellClasses } from "@mui/material/TableCell";
import { useState, useEffect } from "react";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";
import { changeDateFormat } from "@lib/changeDateFormat";
import { useRecoilState, useRecoilValue } from "recoil";
import { membersState } from "@store/admin/membersState";
import { roleFilterState } from "@store/admin/roleFilterState";
import useModal from "hooks/useModal";
import MemberDeleteDialog from "./MemberDeleteDialog";
import MemberEditDialog from "./MemberEditDialog";

const MemberTable = ({ initialMembers }: { initialMembers: User[] }) => {
  const [isAscending, setIsAscending] = useState(true);
  const { admin, seller, buyer } = useRecoilValue(roleFilterState);
  const [members, setMembers] = useRecoilState(membersState);
  const { openModal, closeModal } = useModal();

  const onClickDeleteButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    openModal(MemberDeleteDialog, {
      id: String(e.currentTarget.dataset.memberid),
      handleClose: closeModal,
    });
  };

  const onClickEditButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = String(e.currentTarget.dataset.memberid);
    const user = members.find((member) => member.id === id);
    if (user === undefined) return;
    const { userId, firstName, lastName, role } = user;
    openModal(MemberEditDialog, {
      id,
      initialState: {
        userId,
        firstName,
        lastName,
        role,
      },
      handleClose: closeModal,
    });
  };

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Role</StyledTableCell>
            <StyledTableCell onClick={() => setIsAscending((state) => !state)}>
              Create At
              <StyledButton>
                {isAscending ? <BsArrowDownShort /> : <BsArrowUpShort />}
              </StyledButton>
            </StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {[...members]
            .sort(({ createdAt: a }, { createdAt: b }) => {
              if (a < b) {
                return isAscending ? 1 : -1;
              } else if (a > b) {
                return isAscending ? -1 : 1;
              } else {
                return 0;
              }
            })
            .filter((member) => {
              if (admin && member.role === "ADMIN") return true;
              if (seller && member.role === "SELLER") return true;
              if (buyer && member.role === "BUYER") return true;
              return false;
            })
            .map((member) => (
              <StyledTableRow
                key={member.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell component="th" scope="row">
                  {member.userId}
                </StyledTableCell>
                <StyledTableCell sx={{ textTransform: "capitalize" }}>
                  {member.firstName} {member.lastName}
                </StyledTableCell>
                <StyledTableCell
                  color={
                    member.role === "ADMIN"
                      ? "warning"
                      : member.role === "SELLER"
                      ? "info"
                      : "success"
                  }
                >
                  {member.role}
                </StyledTableCell>
                <StyledTableCell>
                  {changeDateFormat(new Date(String(member.createdAt)))}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title="edit" arrow>
                    <IconButton
                      size="small"
                      data-memberid={member.id}
                      onClick={onClickEditButton}
                      className="margin"
                    >
                      <FaEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="delete" arrow>
                    <IconButton
                      size="small"
                      data-memberid={member.id}
                      onClick={onClickDeleteButton}
                      className="margin"
                    >
                      <IoMdTrash />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#222222",
    color: theme.palette.common.white,
    fontFamily: "Pretendard",
    fontSize: "1.1rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "1rem",
    fontFamily: "Pretendard",
  },
  "button.margin": {
    marginLeft: "10px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledButton = styled(IconButton)`
  color: white;
  margin: 0;
  svg {
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

export default MemberTable;
