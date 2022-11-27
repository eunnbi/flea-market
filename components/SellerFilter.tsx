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

type State = User & {
  rating: string;
};

const SellerFilter = ({ sellers }: { sellers: State[] }) => {
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
        sx={{ textTransform: 'capitalize' }}
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
                data-name={`${seller.firstName} ${seller.lastName}`}
                onClick={onClick}>
                <ListItemButton sx={{ display: 'flex', gap: '1rem' }}>
                  <ListItemText
                    primary={`${seller.firstName} ${seller.lastName}`}
                    secondary={`⭐ ${seller.rating}`}
                    sx={{ textTransform: 'capitalize' }}
                  />
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
