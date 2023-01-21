import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import React, { ChangeEvent, useRef } from "react";
import styled from "@emotion/styled";
import { noError } from "@lib/createErrorObject";
import { useRecoilState } from "recoil";
import { imageFileState } from "@store/product/productFormState";

interface Props {
  imageUrl?: string;
  errorInfo: typeof noError;
}

const ImageUpload = ({ imageUrl, errorInfo }: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useRecoilState(imageFileState);
  const changeImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files![0]);
    }

    e.target.value = "";
  };
  return (
    <Wrapper>
      {imageFile ? (
        <img src={URL.createObjectURL(imageFile)} />
      ) : (
        imageUrl && <img src={imageUrl} />
      )}
      <div>
        <button onClick={() => ref.current?.click()} type="button">
          <MdOutlineAddPhotoAlternate />
          사진 업로드
        </button>
        <input
          type="file"
          accept="image/*"
          ref={ref}
          onChange={changeImageFile}
        />
        {errorInfo.isError && (
          <p className="text-xs mt-2 text-red-600">{errorInfo.message}</p>
        )}
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
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.66;
    letter-spacing: 0.03333em;
  }
`;

export default React.memo(ImageUpload);
