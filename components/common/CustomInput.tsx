import { FormControl, InputLabel, Input, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import { ChangeEventHandler, useState } from 'react';
import { BsEyeSlashFill, BsEyeFill } from 'react-icons/bs';

interface Props {
  label: string;
  isPassword: boolean;
  htmlFor: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value: string;
  errorInfo: {
    isError: boolean;
    message: string;
  };
  helperText?: string;
}

const CustomInput = ({ label, isPassword, htmlFor, onChange, value, helperText, errorInfo }: Props) => {
  const { isError, message } = errorInfo;
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(value => !value);
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <FormControl sx={{ m: 1, width: '100%', margin: 0 }} variant="standard">
      <InputLabel htmlFor={htmlFor} error={isError}>
        {label}
      </InputLabel>
      {isPassword ? (
        <Input
          error={isError}
          id={htmlFor}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end">
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </IconButton>
            </InputAdornment>
          }
        />
      ) : (
        <Input id={htmlFor} type="text" value={value} onChange={onChange} error={isError} />
      )}
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      {message ? <FormHelperText error>{message}</FormHelperText> : null}
    </FormControl>
  );
};

export default CustomInput;
