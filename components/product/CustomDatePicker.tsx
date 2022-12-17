import { noError } from '@lib/createErrorObject';
import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface Props {
  date: Dayjs;
  setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  errorInfo: typeof noError;
}

const CustomDatePicker = ({ date, setDate, errorInfo }: Props) => {
  return (
    <div id="date-picker">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Choose Ending Date"
          value={date}
          onChange={value => {
            if (value === null) return;
            setDate(value);
          }}
          disablePast
          renderInput={params => (
            <TextField {...params} disabled error={errorInfo.isError} helperText={errorInfo.message} />
          )}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CustomDatePicker;
