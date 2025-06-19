import Image from 'next/image';
import { Button } from './ui/button';
import Search from './Search';
import FileUploader from './FileUploader';

type Props = {};

const Header = ({}: Props) => {
  return (
    <header className='header'>
      <Search />

      <div className='header-wrapper flex-center'>
        <FileUploader />

        <form>
          <Button
            type='button'
            className='sign-out-button flex-center'
          >
            <Image
              src='/assets/icons/logout.svg'
              alt='logo'
              width={24}
              height={24}
              className='w-6'
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
