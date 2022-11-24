import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { User } from '@prisma/client';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { searchState } from 'store/searchState';
import { BiUser } from 'react-icons/bi';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const SellerFilter = ({ sellers }: { sellers: User[] }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useRecoilState(searchState);
  const handleClose = () => setOpen(false);
  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const { id, name } = e.currentTarget.dataset;
    if (id === undefined || name === undefined) return;
    setState(state => ({ ...state, seller: { id, name } }));
    handleClose();
  };
  const onDelete = () => {
    setState(state => ({ ...state, seller: { id: '', name: '' } }));
  };
  return (
    <>
      <Chip
        icon={<BiUser />}
        label={`판매자 : ${state.seller.name}`}
        variant={state.seller.name === '' ? 'outlined' : 'filled'}
        onClick={() => setOpen(true)}
        onDelete={state.seller.name === '' ? undefined : onDelete}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">판매자</DialogTitle>
        <DialogContent>
          <List>
            {sellers.map(seller => (
              <ListItem
                disablePadding
                key={seller.id}
                data-id={seller.userId}
                data-name={seller.name}
                onClick={onClick}>
                <ListItemButton sx={{ display: 'flex', gap: '1rem' }}>
                  <Avatar {...stringAvatar(seller.name)} />
                  <ListItemText primary={seller.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SellerFilter;
