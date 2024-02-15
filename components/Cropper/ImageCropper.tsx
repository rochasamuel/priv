import { FunctionComponent, forwardRef, useRef, useState } from "react";
import { CropperRef, Cropper } from "react-mobile-cropper";
import "react-mobile-cropper/dist/style.css";
import { Button } from "../ui/button";

interface ImageCropperProps {
  type?: string;
  imageSrc?: string;
}

const ImageCropper = forwardRef<CropperRef, ImageCropperProps>(
  ({imageSrc, type}, ref) => {
    const [image, setImage] = useState(imageSrc);

    return <Cropper ref={ref} src={image} />
  }
);

ImageCropper.displayName = "ImageCropper";
export default ImageCropper;
