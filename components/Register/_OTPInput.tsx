"use client"
import React, { useState, ChangeEvent, ClipboardEvent, useRef } from 'react';
import { Input } from '../ui/input';

const OTPInput: React.FC = () => {
  const [otp, setOTP] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const assignRef = (el: HTMLInputElement | null, index: number) => {
    inputRefs.current[index] = el;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if ((e.key === 'Backspace' || e.keyCode === 8) && index >= 0) {
      e.preventDefault(); // Prevent the default behavior of Backspace in some browsers
      const newOTP = [...otp];
      newOTP[index] = '';
      setOTP(newOTP);
      inputRefs.current[index - 1]?.focus();
    } else if (/^\d$/.test(e.key) && index < otp.length) {
      const newOTP = [...otp];
      newOTP[index] = e.key;
      setOTP(newOTP);

      if (index < otp.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('text/plain');
    const pastedOTP = clipboardData.slice(0, 6).replace(/[^\d]/g, '').split('');

    const newOTP = [...otp];

    for (const [index, digit] of pastedOTP.entries()) {
      if (newOTP[index] !== undefined) {
        newOTP[index] = digit;
      }
    }

    setOTP(newOTP);
  };

  return (
    <div className="w-full flex gap-2 items-center justify-between">
      {otp.map((digit, index) => (
        <Input
          className="w-14 h-14 text-center text-lg font-medium"
          key={index + 1}
          type="text"
          value={digit}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          maxLength={1}
          ref={(el) => assignRef(el, index)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
