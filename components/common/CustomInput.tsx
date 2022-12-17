import {
  FormControl,
  InputLabel,
  Input,
  IconButton,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { ChangeEventHandler, useState } from "react";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";

interface Props {
  type?: string;
  label: string;
  isPassword: boolean;
  htmlFor: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  defaultValue?: string;
  errorInfo: {
    isError: boolean;
    message: string;
  };
  helperText?: string;
  disabled?: boolean;
  multiline?: boolean;
  icon?: React.ReactNode;
}

const CustomInput = ({
  type,
  label,
  isPassword,
  htmlFor,
  onChange,
  helperText,
  errorInfo,
  disabled,
  icon,
  multiline,
  defaultValue,
}: Props) => {
  const { isError, message } = errorInfo;
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((value) => !value);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <FormControl
      sx={{ m: 1, width: "100%", margin: 0 }}
      variant="standard"
      disabled={disabled}
    >
      <InputLabel htmlFor={htmlFor} error={isError}>
        {label}
      </InputLabel>
      {isPassword ? (
        <Input
          error={isError}
          id={htmlFor}
          type={showPassword ? "text" : "password"}
          onChange={onChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </IconButton>
            </InputAdornment>
          }
        />
      ) : icon ? (
        <Input
          id={htmlFor}
          type={type ? type : "text"}
          onChange={onChange}
          error={isError}
          endAdornment={icon}
          defaultValue={defaultValue}
        />
      ) : (
        <Input
          id={htmlFor}
          type={type ? type : "text"}
          onChange={onChange}
          error={isError}
          multiline={multiline}
          defaultValue={defaultValue}
        />
      )}
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      {message ? <FormHelperText error>{message}</FormHelperText> : null}
    </FormControl>
  );
};

CustomInput.defaultProps = {
  defaultValue: "",
};

export default CustomInput;
