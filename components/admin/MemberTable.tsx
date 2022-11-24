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
} from '@mui/material';
import { User } from '@prisma/client';
import { styled } from '@mui/material/styles';
import { IoMdTrash } from 'react-icons/io';
import { FaEdit } from 'react-icons/fa';
import { tableCellClasses } from '@mui/material/TableCell';
import { useState, useEffect } from 'react';
import SimpleDialog from '../common/SimpleDialog';
import EditDialog from './EditDialog';
import axios from 'axios';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import Filter from './Filter';

type State = Pick<User, 'userId' | 'name' | 'role'>;

const MemberTable = ({ initialMembers }: { initialMembers: User[] }) => {
  const [roleFilter, setRoleFilter] = useState({
    admin: true,
    seller: true,
    buyer: true,
  });
  const { admin, seller, buyer } = roleFilter;
  const [isAscending, setIsAscending] = useState(true);
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState(initialMembers);
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: '',
  });

  const [editState, setEditState] = useState<{ open: boolean; id: string; state: State }>({
    open: false,
    id: '',
    state: {
      userId: '',
      name: '',
      role: 'ADMIN',
    },
  });

  const onClickDeleteButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteState({
      open: true,
      id: String(e.currentTarget.ariaLabel),
    });
  };

  const onClickEditButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = String(e.currentTarget.ariaLabel);
    const user = members.find(member => member.id === id);
    if (user === undefined) return;
    console.log(user);
    const { userId, name, role } = user;
    setEditState({
      open: true,
      id,
      state: {
        userId,
        name,
        role,
      },
    });
  };

  const handleClose = (type: 'delete' | 'edit') => {
    if (type === 'delete') {
      return () =>
        setDeleteState(state => ({
          ...state,
          open: false,
        }));
    } else {
      return () =>
        setEditState(state => ({
          ...state,
          open: false,
        }));
    }
  };

  const deleteMember = (id: string) => async () => {
    await axios.delete(`/api/user/${id}`);
    const { data } = await axios.get('/api/user');
    setMembers(data);
    setMessage('삭제가 완료되었습니다.');
  };

  const editMember = (id: string) => async (state: State) => {
    await axios.patch(`/api/user/${id}`, state);
    const { data } = await axios.get(`/api/user`);
    setMembers(data);
    setMessage('수정이 완료되었습니다.');
  };

  const onChangeFilter = (e: any) => {
    const textContent: 'admin' | 'buyer' | 'seller' = e.target.textContent;
    setRoleFilter(state => ({ ...state, [textContent]: !state[textContent] }));
  };

  useEffect(() => {
    if (message === '') return;
    setTimeout(() => {
      setMessage('');
    }, 2000);
  }, [message]);

  return (
    <>
      {message && <Alert severity="success">{message}</Alert>}
      <Filter roleFilter={roleFilter} onChangeFilter={onChangeFilter} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell onClick={() => setIsAscending(state => !state)}>
                Create At<StyledButton>{isAscending ? <BsArrowDownShort /> : <BsArrowUpShort />}</StyledButton>
              </StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {members
              .sort(({ createdAt: a }, { createdAt: b }) => {
                if (a < b) {
                  return isAscending ? 1 : -1;
                } else if (a > b) {
                  return isAscending ? -1 : 1;
                } else {
                  return 0;
                }
              })
              .filter(member => {
                if (admin && member.role === 'ADMIN') return true;
                if (seller && member.role === 'SELLER') return true;
                if (buyer && member.role === 'BUYER') return true;
                return false;
              })
              .map(member => (
                <StyledTableRow key={member.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <StyledTableCell component="th" scope="row">
                    {member.userId}
                  </StyledTableCell>
                  <StyledTableCell>{member.name}</StyledTableCell>
                  <StyledTableCell
                    color={member.role === 'ADMIN' ? 'warning' : member.role === 'SELLER' ? 'info' : 'success'}>
                    {member.role}
                  </StyledTableCell>
                  <StyledTableCell>
                    {`${String(member.createdAt).split('T')[0]}  ${
                      String(member.createdAt).split('T')[1].split('.')[0]
                    }`}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="edit" arrow>
                      <IconButton size="small" aria-label={member.id} onClick={onClickEditButton} className="margin">
                        <FaEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="delete" arrow>
                      <IconButton size="small" aria-label={member.id} onClick={onClickDeleteButton} className="margin">
                        <IoMdTrash />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SimpleDialog
        open={deleteState.open}
        handleClose={handleClose('delete')}
        onConfirm={deleteMember(deleteState.id)}
        basicTitle="정말 삭제하시겠습니까?"
        loadingTitle="삭제 중..."
        content="유저 관련 데이터도 전부 삭제됩니다."
      />
      <EditDialog
        open={editState.open}
        handleClose={handleClose('edit')}
        initialState={editState.state}
        editMember={editMember(editState.id)}
      />
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#222222',
    color: theme.palette.common.white,
    fontFamily: 'Pretendard',
    fontSize: '1.1rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '1rem',
    fontFamily: 'Pretendard',
  },
  'button.margin': {
    marginLeft: '10px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
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
