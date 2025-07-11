'use client';

import { useState } from 'react';
import Image from 'next/image';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import { navItems } from '../../constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import FileUploader from './FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';

type Props = {
  $id: string;
  accountId: string;
  fullname: string;
  email: string;
  avatar: string;
};

const MobileNavigation = ({
  $id: ownerId,
  accountId,
  fullname,
  email,
  avatar,
}: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className='mobile-header'>
      <Image
        src='/assets/icons/logo-full-brand.svg'
        alt='logo'
        width={120}
        height={52}
        className='h-auto'
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src='/assets/icons/menu.svg'
            alt='menu'
            width={30}
            height={30}
          />
        </SheetTrigger>

        <SheetContent
          aria-describedby=''
          className='shad-sheet h-screen px-3'
        >
          <SheetTitle>
            <div className='header-user'>
              <Image
                src={avatar}
                alt='avatar'
                width={44}
                height={44}
                className='header-user-avatar'
              />

              <div className='sm:hiden lg:block'>
                <p className='subtitle-2 capitalize'>{fullname}</p>
                <p className='caption'>{email}</p>
              </div>
            </div>

            <Separator className='mb-4 bg-light-200/20' />
          </SheetTitle>

          <nav className='mobile-nav h5'>
            <ul className='mobile-nav-list'>
              {navItems.map(({ url, name, icon }) => (
                <Link href={url} key={name} className='lg:w-full'>
                  <li
                    className={cn(
                      'mobile-nav-item h5',
                      pathname === url && 'shad-active'
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        'nav-icon',
                        pathname === url && 'nav-icon-active'
                      )}
                    />
                    <p>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          <FileUploader ownerId={ownerId} accountId={accountId} />
          <Separator className='my-5 bg-light-200/20' />

          <div className='flex flex-col justify-between gap-5 pb-5'>
            <Button
              type='submit'
              className='mobile-sign-out-button flex-center'
              onClick={async () => {
                await signOutUser();
              }}
            >
              <Image
                src='/assets/icons/logout.svg'
                alt='logo'
                width={24}
                height={24}
              />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
