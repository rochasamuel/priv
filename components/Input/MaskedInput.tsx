"use client";

import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import Inputmask from "inputmask";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
}

export default function MaskedInput({mask, ...props}: MaskedInputProps) {
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const phoneInput = phoneInputRef.current;

    if (phoneInput)
      Inputmask({
        mask: mask,
        showMaskOnFocus: false,
        showMaskOnHover: false,
        removeMaskOnSubmit: true,
        autoUnmask: true,
      }).mask(phoneInput);

    return () => {
      if (phoneInput) Inputmask.remove(phoneInput);
    };
  }, [mask]);

  return <Input ref={phoneInputRef} {...props} />;
}