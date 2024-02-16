import { forwardRef, useState } from "react";
import { Cropper, CropperRef, CircleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

interface ImageCropperProps {
  type?: "cover" | "profile";
  imageSrc?: string;
}

const AccountImageCropper = forwardRef<CropperRef, ImageCropperProps>(
  ({ imageSrc, type }, ref) => {
    const [image, setImage] = useState(imageSrc);

    return (
      <>
        {type === "cover" ? (
          <Cropper
            stencilProps={{
              movable: true,
              resizable: true,
              aspectRatio: 16 / 4,
              grid: true,
            }}
            ref={ref}
            src={image}
          />
        ) : (
          <Cropper
            stencilProps={{
              movable: true,
              resizable: true,
              aspectRatio: 1,
              grid: true,
            }}
            stencilComponent={CircleStencil}
            ref={ref}
            src={image}
          />
        )}
      </>
    );
  }
);

AccountImageCropper.displayName = "AccountImageCropper";
export default AccountImageCropper;
