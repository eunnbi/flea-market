import { noError, createErrorObject } from '@lib/createErrorObject';
import { Button, Chip, IconButton, InputAdornment } from '@mui/material';
import { Product } from '@prisma/client';
import React, { useState, useCallback } from 'react';
import CustomInput from './common/CustomInput';
import Map from './common/Map';
import dayjs, { Dayjs } from 'dayjs';
import CustomDatePicker from './common/CustomDatePicker';
import { BiSearchAlt } from 'react-icons/bi';
import ImageUpload from './common/ImageUpload';
import styled from '@emotion/styled';
import axios from 'axios';
import Router from 'next/router';
import { ProductItem } from './common/ProductList';
import { getImageUrl } from '@lib/getImageUrl';

type State = Pick<Product, 'name' | 'phoneNumber' | 'tradingPlace' | 'status' | 'content'> & {
  price: string;
};

const ProductRegisterForm = ({ initialProduct }: { initialProduct: ProductItem | null }) => {
  const [errorInfo, setErrorInfo] = useState({
    name: noError,
    phoneNumber: noError,
    price: noError,
    tradingPlace: noError,
    endingAt: noError,
    imageFile: noError,
    content: noError,
  });
  const [values, setValues] = useState<State>(
    initialProduct === null
      ? {
          name: '',
          phoneNumber: '',
          price: '',
          tradingPlace: '',
          status: 'PROGRESS',
          content: '',
        }
      : {
          name: initialProduct.name,
          phoneNumber: initialProduct.phoneNumber,
          price: String(initialProduct.price),
          tradingPlace: initialProduct.tradingPlace,
          status: initialProduct.status,
          content: initialProduct.content,
        },
  );
  const [location, setLocation] = useState(initialProduct !== null ? initialProduct.tradingPlace : '');
  const endingDate = initialProduct === null ? new Date() : new Date(String(initialProduct.endingAt));

  const [endingAt, setEndingAt] = useState<Dayjs>(
    dayjs(`${endingDate.getFullYear()}-${endingDate.getMonth() + 1}-${endingDate.getDate()} 00:00:00`),
  );
  const [imageFile, setImageFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { name, phoneNumber, price, tradingPlace, status, content } = values;
  const handleChange = useCallback(
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues(values => ({ ...values, [prop]: event.target.value }));
    },
    [],
  );
  const toggleStatus = useCallback(() => {
    setValues(values => ({ ...values, status: values.status === 'AUCTION' ? 'PROGRESS' : 'AUCTION' }));
  }, []);
  const changeLocation = useCallback((location: string) => {
    setLocation(location);
  }, []);
  const changeImageFile = useCallback((e: any) => {
    setImageFile(e.target.files[0]);
    e.target.value = '';
  }, []);
  const setLocationErrorInfo = useCallback((isError: boolean) => {
    if (isError) {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        tradingPlace: createErrorObject('잘못된 주소입니다. 정확한 주소값을 입력해주세요.'),
      }));
    } else {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        tradingPlace: noError,
      }));
    }
  }, []);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageFile === null && !initialProduct?.image) {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        imageFile: createErrorObject('사진을 업로드해주세요'),
      }));
      return;
    } else {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        imageFile: noError,
      }));
    }
    if (name === '') {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        name: createErrorObject('상품 이름을 입력해주세요'),
      }));
      return;
    } else {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        name: noError,
      }));
    }
    if (content === '') {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        content: createErrorObject('상품 설명을 입력해주세요'),
      }));
      return;
    } else {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        content: noError,
      }));
    }
    if (phoneNumber === '') {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        phoneNumber: createErrorObject('전화번호를 입력해주세요'),
      }));
      return;
    } else if (!/01[016789]-[^0][0-9]{3,4}-[0-9]{4}/.test(phoneNumber)) {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        phoneNumber: createErrorObject('전화번호 형식에 맞춰 입력해주세요'),
      }));
      return;
    } else {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        phoneNumber: noError,
      }));
    }
    if (tradingPlace === '') {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        tradingPlace: createErrorObject('거래 장소를 입력해주세요.'),
      }));
      return;
    } else if (tradingPlace !== location) {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        tradingPlace: createErrorObject('옆에 있는 돋보기 버튼을 눌러주세요.'),
      }));
      return;
    }
    if (status === 'PROGRESS') {
      if (price === '') {
        setErrorInfo(errorInfo => ({
          ...errorInfo,
          price: createErrorObject('상품 가격을 입력해주세요'),
        }));
        return;
      } else if (Number.isNaN(Number(price))) {
        setErrorInfo(errorInfo => ({
          ...errorInfo,
          price: createErrorObject('숫자만 입력해주세요'),
        }));
        return;
      } else if (Number(price) < 0) {
        setErrorInfo(errorInfo => ({
          ...errorInfo,
          price: createErrorObject('0 이상의 가격만 가능합니다.'),
        }));
        return;
      } else {
        setErrorInfo(errorInfo => ({
          ...errorInfo,
          price: noError,
        }));
      }
    }
    try {
      setLoading(true);
      if (initialProduct) {
        // 수정
        if (imageFile === null) {
          // 이미지 수정은 없음
          if (status === 'AUCTION') {
            await axios.patch(`/api/product/${initialProduct.id}`, {
              name,
              price: 0,
              endingAt,
              phoneNumber,
              tradingPlace,
              status,
              content,
            });
          } else {
            await axios.patch(`/api/product/${initialProduct.id}`, {
              name,
              price: Number(price),
              endingAt: null,
              phoneNumber,
              tradingPlace,
              status,
              content,
            });
          }
        } else {
          // 이미지 수정 있음
          await axios.delete(`/api/product/image/${initialProduct.image.id}`);
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('upload_preset', String(process.env.NEXT_PUBLIC_IMAGE_PRESET));
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
            {
              method: 'POST',
              body: formData,
            },
          );
          const imageData = await response.json();
          const { format, public_id: publicId, version } = imageData;
          const { data } = await axios.post('/api/product/image', {
            format,
            publicId,
            version: String(version),
          });
          if (status === 'AUCTION') {
            await axios.patch(`/api/product/${initialProduct.id}`, {
              name,
              price: 0,
              endingAt,
              phoneNumber,
              tradingPlace,
              imageId: data.image.id,
              status,
              content,
            });
          } else {
            await axios.patch(`/api/product/${initialProduct.id}`, {
              name,
              price: Number(price),
              endingAt: null,
              phoneNumber,
              tradingPlace,
              status,
              content,
              imageId: data.image.id,
            });
          }
        }
        setLoading(false);
        Router.push(
          `/sell/products/${initialProduct.id}?alert=🎉 상품을 성공적으로 수정했습니다.`,
          `/sell/products/${initialProduct.id}`,
        );
      } else {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', String(process.env.NEXT_PUBLIC_IMAGE_PRESET));
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );
        const imageData = await response.json();
        const { format, public_id: publicId, version } = imageData;
        const { data } = await axios.post('/api/product/image', {
          format,
          publicId,
          version: String(version),
        });
        if (status === 'AUCTION') {
          const { data: productData } = await axios.post('/api/product', {
            name,
            price: 0,
            endingAt,
            phoneNumber,
            tradingPlace,
            imageId: data.image.id,
            status,
            content,
          });
          const { success, product } = productData;
          if (success) {
            Router.push(
              `/sell/products/${product.id}?alert=🎉 상품을 성공적으로 등록했습니다.`,
              `/sell/products/${product.id}`,
            );
          } else {
            setLoading(false);
            alert('상품 등록에 실패하였습니다. 다시 등록해주세요.');
          }
        } else {
          const { data: productData } = await axios.post('/api/product', {
            name,
            price: Number(price),
            endingAt: null,
            phoneNumber,
            tradingPlace,
            imageId: data.image.id,
            status,
            content,
          });
          const { success, product } = productData;
          if (success) {
            Router.push(
              `/sell/products/${product.id}?alert=🎉 상품을 성공적으로 등록했습니다.`,
              `/sell/products/${product.id}`,
            );
          } else {
            setLoading(false);
            alert('상품 등록에 실패하였습니다. 다시 등록해주세요.');
          }
        }
      }
    } catch (e) {
      setLoading(false);
      alert('상품 등록에 실패하였습니다. 다시 등록해주세요.');
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <div className="row">
        <Chip
          label="판매"
          variant={status === 'PROGRESS' ? 'filled' : 'outlined'}
          onClick={toggleStatus}
          color="primary"
        />
        <Chip
          label="경매"
          variant={status === 'AUCTION' ? 'filled' : 'outlined'}
          onClick={toggleStatus}
          color="primary"
        />
      </div>
      <ImageUpload
        imageFile={imageFile}
        changeImageFile={changeImageFile}
        errorInfo={errorInfo.imageFile}
        imageUrl={initialProduct?.image ? getImageUrl(initialProduct.image) : undefined}
      />
      <CustomInput
        label="🛍️ Product's Name"
        onChange={handleChange('name')}
        htmlFor="name"
        value={name}
        isPassword={false}
        errorInfo={errorInfo.name}
      />
      <CustomInput
        label="📝 Product's Explanation"
        onChange={handleChange('content')}
        htmlFor="content"
        value={content}
        isPassword={false}
        multiline={true}
        errorInfo={errorInfo.content}
      />
      {status === 'PROGRESS' ? (
        <CustomInput
          label="💲Price"
          onChange={handleChange('price')}
          htmlFor="price"
          value={price}
          isPassword={false}
          errorInfo={errorInfo.price}
        />
      ) : (
        <CustomDatePicker date={endingAt} setDate={setEndingAt} errorInfo={errorInfo.endingAt} />
      )}
      <CustomInput
        label="📞 Your Phone Number"
        onChange={handleChange('phoneNumber')}
        htmlFor="phoneNumber"
        isPassword={false}
        errorInfo={errorInfo.phoneNumber}
        type="phone"
        value={phoneNumber}
        helperText="'-'를 포함해주세요 (예시: 010-1234-5678)"
      />
      <div className="trading">
        <CustomInput
          label="📌 Trading Place"
          htmlFor="search map"
          value={tradingPlace}
          onChange={handleChange('tradingPlace')}
          isPassword={false}
          errorInfo={errorInfo.tradingPlace}
          icon={
            <InputAdornment position="end">
              <IconButton aria-label="search icon" edge="end" onClick={() => changeLocation(tradingPlace)}>
                <BiSearchAlt />
              </IconButton>
            </InputAdornment>
          }
        />
        <Map location={location} setLocationErrorInfo={setLocationErrorInfo} />
      </div>
      <Button variant="contained" type="submit" disabled={loading}>
        {loading ? (initialProduct?.id ? '수정 중...' : '등록 중...') : initialProduct?.id ? '수정하기' : '등록하기'}
      </Button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  .row {
    display: flex;
    gap: 1rem;
    span {
      font-size: 0.9rem;
    }
  }
  button[type='submit'] {
    max-width: 400px;
    margin: 0 auto;
  }
  p.warning {
    color: red;
  }
  #map {
    margin-top: 1rem;
  }
`;

export default ProductRegisterForm;
