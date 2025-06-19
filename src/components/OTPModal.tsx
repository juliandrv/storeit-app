'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { Button } from './ui/button';

import {
  sendEmailOTP,
  verifySecret,
} from '@/lib/actions/user.actions';

type Props = {
  email: string;
  accountId: string;
  onClose?: () => void;
};

const OTPModal = ({ email, accountId, onClose }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const sessionId = await verifySecret({ accountId, password });
      if (sessionId) {
        router.push('/');
        setIsOpen(false);
      }
    } catch (error) {
      console.log('Error submitting OTP');
      setError('Failed to verify OTP. Please try again.');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleResendOTP = async () => {
    await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open && onClose) onClose();
    }}>
      <AlertDialogContent className='shad-alert-dialog'>
        <AlertDialogHeader className='relative flex justify-center'>
          <AlertDialogTitle className='h2 text-center'>
            Enter your OTP
            <Image
              src='/assets/icons/close-dark.svg'
              alt='close'
              width={20}
              height={20}
              onClick={handleClose}
              className='otp-close-button'
            />
          </AlertDialogTitle>

          <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
            We&apos;ve sent a code to{' '}
            <span className='pl-1 text-brand'>{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP
          maxLength={6}
          value={password}
          onChange={setPassword}
        >
          <InputOTPGroup className='shad-otp'>
            <InputOTPSlot index={0} className='shad-otp-slot' />
            <InputOTPSlot index={1} className='shad-otp-slot' />
            <InputOTPSlot index={2} className='shad-otp-slot' />

            <InputOTPSlot index={3} className='shad-otp-slot' />
            <InputOTPSlot index={4} className='shad-otp-slot' />
            <InputOTPSlot index={5} className='shad-otp-slot' />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className='flex w-full flex-col gap-4'>
            {error && (
              <p className='error-message subtitle-2 text-center !w-full'>
                {error}
              </p>
            )}

            <AlertDialogAction
              type='button'
              onClick={handleSubmit}
              className='button shad-submit-btn h-12'
              disabled={isLoading}
            >
              Submit
              {isLoading && (
                <Image
                  src='/assets/icons/loader.svg'
                  alt='loader'
                  width={24}
                  height={24}
                  className='ml-2 animate-spin'
                />
              )}
            </AlertDialogAction>

            <div className='subtitle-2 mt-2 text-center text-light-100'>
              Didn&apos;t get the code?
              <Button
                type='button'
                variant='link'
                className='pl-1 text-brand cursor-pointer'
                onClick={handleResendOTP}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
