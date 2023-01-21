import { createErrorObject, noError } from "@lib/createErrorObject";
import { InputAdornment, IconButton } from "@mui/material";
import { locationState, mapErrorState } from "@store/mapState";
import { errorInfoState } from "@store/product/errorInfoState";
import { tradingPlaceState } from "@store/product/productFormState";
import { useCallback, useEffect } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { useRecoilValue, useSetRecoilState } from "recoil";

const MapSearchButton = () => {
  const tradingPlace = useRecoilValue(tradingPlaceState);
  const setLocation = useSetRecoilState(locationState);
  const isMapError = useRecoilValue(mapErrorState);
  const setErrorInfo = useSetRecoilState(errorInfoState);
  const changeLocation = useCallback(() => {
    setLocation(tradingPlace);
  }, []);
  useEffect(() => {
    if (isMapError) {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        tradingPlace: createErrorObject(
          "잘못된 주소입니다. 정확한 주소값을 입력해주세요."
        ),
      }));
    } else {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        tradingPlace: noError,
      }));
    }
  }, [isMapError]);
  return (
    <InputAdornment position="end">
      <IconButton aria-label="search icon" edge="end" onClick={changeLocation}>
        <BiSearchAlt />
      </IconButton>
    </InputAdornment>
  );
};

export default MapSearchButton;
