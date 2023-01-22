import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import React, { ChangeEvent, useRef } from "react";
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
    <div className="flex flex-col items-center gap-8 relative">
      {imageFile ? (
        <img src={URL.createObjectURL(imageFile)} className="max-w-full" />
      ) : (
        imageUrl && <img src={imageUrl} />
      )}
      <div>
        <button
          onClick={() => ref.current?.click()}
          type="button"
          className="flex items-center gap-3 p-4 rounded-md border-2 border-solid border-black"
        >
          <MdOutlineAddPhotoAlternate className="text-2xl" />
          사진 업로드
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={ref}
          onChange={changeImageFile}
        />
        {errorInfo.isError && (
          <p className="text-xs mt-2 text-red-600 text-center">
            {errorInfo.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(ImageUpload);
