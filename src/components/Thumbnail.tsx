import Image from 'next/image';
import { cn, getFileIcon } from '@/lib/utils';

type Props = {
  type: string;
  extension: string;
  url: string;
  imageClassName?: string;
  className?: string;
};

const Thumbnail = ({
  type,
  extension,
  url = '',
  imageClassName,
  className,
}: Props) => {
  const isImage = type === 'image' && extension !== 'svg';

  return (
    <figure className={cn('thumbnail flex-center', className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt='thumbnail'
        width={100}
        height={100}
        className={cn(
          'size-8 object-contain',
          imageClassName,
          isImage && 'thumbnail-image'
        )}
      />
    </figure>
  );
};

export default Thumbnail;
