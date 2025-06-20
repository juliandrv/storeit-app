import Sort from '@/components/Sort';
import { getFiles } from '@/lib/actions/file.actions';

const Page = async ({ params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || '';

  const files = await getFiles();

  return (
    <div className='page-container'>
      <section className='w-full'>
        <h1 className='h1 capitalize'>{type}</h1>

        <div className='total-size-section'>
          <p className='body-1'>
            Total: <span className='h5'>0 MB</span>
          </p>

          <div className='sort-container'>
            <p className='body-1 hidden sm:block text-light-100'>
              Sort by:
            </p>
            <Sort />
          </div>
        </div>
      </section>

      {/* render the files */}
      {files.length > 0 ? (
        <section className='files-section'></section>
      ) : (
        <p className='empty-list body-1'>No files found</p>
      )}
    </div>
  );
};

export default Page;
