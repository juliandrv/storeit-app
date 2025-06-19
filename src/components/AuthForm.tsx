'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createAccount } from '@/lib/actions/user.actions';
import OTPModal from './OTPModal';

type FormType = 'sign-in' | 'sign-up';

type Props = {
  type: FormType;
};

const authFormSchema = (type: FormType) => {
  return z.object({
    fullname:
      type === 'sign-up'
        ? z.string().min(2).max(50)
        : z.string().optional(),
    email: z.string().email(),
  });
};

const AuthForm = ({ type }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountId, setAccountId] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      email: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const user = await createAccount({
        fullname: values.fullname || '',
        email: values.email,
      });

      setAccountId(user.accountId);
      setShowOTPModal(true);
    } catch (error) {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='auth-form'
        >
          <h1 className='form-title h1'>
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}{' '}
          </h1>

          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name='fullname'
              render={({ field }) => (
                <FormItem>
                  <div className='shad-form-item'>
                    <FormLabel className='shad-form-label body-2'>
                      Full Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder='Enter your full name'
                        className='shad-input shad-no-focus body-2 p-0 shadow-none'
                        {...field}
                      />
                    </FormControl>
                  </div>

                  <FormMessage className='shad-form-message body-2' />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <div className='shad-form-item'>
                  <FormLabel className='shad-form-label body-2'>
                    Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder='Enter your email'
                      className='shad-input shad-no-focus body-2 p-0 shadow-none'
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className='shad-form-message body-2' />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='form-submit-button primary-button'
            disabled={isLoading}
          >
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}

            {isLoading && (
              <Image
                src='/assets/icons/loader.svg'
                alt='loader'
                width={24}
                height={24}
                className='ml-2 animate-spin'
              />
            )}
          </Button>

          {errorMessage && (
            <p className='error-message'>* {errorMessage}</p>
          )}

          <div className='body-2 flex justify-center'>
            <p className='text-light-100'>
              {type === 'sign-in'
                ? 'New to StoreIt?'
                : 'Already have an account?'}
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
              className='ml-1 font-medium text-brand'
            >
              {type === 'sign-in' ? 'Create an account' : 'Sign In'}{' '}
            </Link>
          </div>
        </form>
      </Form>

      {accountId && showOTPModal && (
        <OTPModal
          email={form.getValues('email')}
          accountId={accountId}
          onClose={() => setShowOTPModal(false)}
        />
      )}
    </>
  );
};

export default AuthForm;
