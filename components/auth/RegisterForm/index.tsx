import {
  FormControl,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import CustomInput from "../../common/CustomInput";
import useRegister from "./useRegister";

const RegisterForm = () => {
  const {
    onSubmit,
    handleChange,
    errorInfo,
    helperText,
    loading,
    checkIdDuplicate,
  } = useRegister();
  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <CustomInput
        label="First Name"
        htmlFor="firstName"
        onChange={handleChange("firstName")}
        isPassword={false}
        errorInfo={errorInfo.firstName}
      />
      <CustomInput
        label="Last Name"
        htmlFor="lastName"
        onChange={handleChange("lastName")}
        isPassword={false}
        errorInfo={errorInfo.lastName}
      />
      <div className="flex items-center">
        <CustomInput
          label="ID"
          htmlFor="userId"
          onChange={handleChange("userId")}
          isPassword={false}
          errorInfo={errorInfo.userId}
          helperText={helperText.userId}
        />
        <Button
          variant="outlined"
          sx={{ flexShrink: 0 }}
          type="button"
          onClick={checkIdDuplicate}
        >
          중복 확인
        </Button>
      </div>
      <CustomInput
        label="Password"
        htmlFor="password"
        onChange={handleChange("password")}
        isPassword={true}
        errorInfo={errorInfo.password}
        helperText={helperText.password}
      />
      <FormControl>
        <FormLabel id="role">Role</FormLabel>
        <RadioGroup
          row
          name="role"
          defaultValue="SELLER"
          onChange={handleChange("role")}
        >
          <FormControlLabel
            value="SELLER"
            control={<Radio size="small" />}
            label="Seller"
          />
          <FormControlLabel
            value="BUYER"
            control={<Radio size="small" />}
            label="Buyer"
          />
        </RadioGroup>
      </FormControl>
      <Button
        variant="contained"
        type="submit"
        disabled={loading}
        className="bg-black"
      >
        {loading ? "회원가입 중..." : "회원가입"}
      </Button>
    </form>
  );
};

export default RegisterForm;
