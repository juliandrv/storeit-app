import { redirect } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import MobileNavigation from '@/components/MobileNavigation';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';

import { getCurrentUser } from '@/lib/actions/user.actions';

type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect('/sign-in');

  return (
    <main className='flex h-screen'>
      <Sidebar {...currentUser} />

      <section className='flex h-full flex-1 flex-col'>
        <MobileNavigation {...currentUser} />

        <Header
          userId={currentUser.$id}
          accountId={currentUser.accountId}
        />

        <div className='main-content'>{children}</div>
      </section>

      <Toaster />
    </main>
  );
};

export default layout;
