import { noError } from "@lib/createErrorObject";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { endingAtState } from "@store/product/endingAtState";
import { statusState } from "@store/product/statusState";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const CustomDatePicker = () => {
  const status = useRecoilValue(statusState);
  const [date, setDate] = useRecoilState(endingAtState);
  return status !== "PROGRESS" ? (
    <div id="date-picker">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Choose Ending Date"
          value={date}
          onChange={(value) => {
            if (value === null) return;
            setDate(value);
          }}
          disablePast
          renderInput={(params) => <TextField {...params} disabled />}
        />
      </LocalizationProvider>
    </div>
  ) : null;
};

export default React.memo(CustomDatePicker);
