import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { noError } from '@lib/createErrorObject';

interface Props {
  imageUrl?: string;
  imageFile: any;
  changeImageFile: (e: any) => void;
  errorInfo: typeof noError;
}

const ImageUpload = ({ imageUrl, imageFile, changeImageFile, errorInfo }: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <Wrapper>
      {imageFile ? <img src={URL.createObjectURL(imageFile)} /> : imageUrl && <img src={imageUrl} />}
      <div>
        <button onClick={() => ref.current?.click()} type="button">
          <MdOutlineAddPhotoAlternate />
          사진 업로드
        </button>
        <input type="file" accept="image/*" ref={ref} onChange={changeImageFile} />
        {errorInfo.isError && <p className="warning">{errorInfo.message}</p>}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: relative;
  input {
    display: none;
  }
  svg {
    font-size: 1.5rem;
  }
  button {
    display: flex;
    align-items: center;
    gap: 1rem;
    border: 2px solid #000;
    border-radius: 5px;
    padding: 1rem;
  }
  p {
    text-align: center;
  }
  img {
    max-width: 100%;
  }
  p.warning {
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.66;
    letter-spacing: 0.03333em;
  }
`;

export default React.memo(ImageUpload);
