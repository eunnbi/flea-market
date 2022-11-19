import { noError } from '@lib/formValidation';
import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation';
import { Dayjs } from 'dayjs';

interface Props {
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
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
            setDate(value);
            console.log(value);
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
