import { changeDateFormat } from "@lib/changeDateFormat";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Bidding, User } from "@prisma/client";

type Props = Bidding & User;

const AuctionHistory = ({ history }: { history: Props[] }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ border: "1px solid lightgray", marginTop: "10px", width: "100%" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">유저 아이디</TableCell>
            <TableCell align="center">입찰 가격</TableCell>
            <TableCell align="center">날짜 및 시간</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((row, index) => {
            const biddingDate = new Date(row.createdAt);
            return (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {row.userId}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: index === 0 ? "bold" : "normal" }}
                >
                  {row.price.toLocaleString()}원
                </TableCell>
                <TableCell align="center">
                  {changeDateFormat(biddingDate)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuctionHistory;
