"use client";

import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import Inputmask from "inputmask";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
}

export default function MaskedInput({mask, ...props}: MaskedInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;

    if (input)
      Inputmask({
        mask: mask,
        showMaskOnFocus: false,
        showMaskOnHover: false,
        removeMaskOnSubmit: true,
        autoUnmask: true,
      }).mask(input);

    return () => {
      if (input) Inputmask.remove(input);
    };
  }, [mask]);

  return <Input ref={inputRef} {...props} />;
}