import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mails, Sparkles, SquarePen, Trash2 } from 'lucide-react';
import { BarLoader } from 'react-spinners';
import { useEntries } from '@/context/EntriesContext';
import ticket from '../../assets/ticket1.png';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';

const ENTRIES_PER_PAGE = 3;
const IMAGE_CARD_CLASS = 'mt-4 w-full max-w-xs rounded-[28px] border border-orange-100 bg-[#fff8f1] p-3 shadow-[0_16px_35px_rgba(209,110,52,0.16)] sm:max-w-sm dark:border-[#4c3227] dark:bg-[#261b17] dark:shadow-[0_18px_40px_rgba(8,4,3,0.38)]';

const Archives = () => {
  const { entries, fetchEntries, loading, deleteEntry, updateEntry, isDisabled } = useEntries();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(entries.length / ENTRIES_PER_PAGE));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, entries.length]);

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const totalPages = Math.max(1, Math.ceil(entries.length / ENTRIES_PER_PAGE));

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
    return entries.slice(startIndex, startIndex + ENTRIES_PER_PAGE);
  }, [currentPage, entries]);

  const handleDelete = async (id) => {
    await deleteEntry(id);
    await fetchEntries();
  };

  const getArchiveContentHtml = (content) => {
    if (typeof window === 'undefined' || !content) {
      return content;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    doc.querySelectorAll('img').forEach((image, index) => {
      const wrapper = doc.createElement('div');
      wrapper.className = 'archive-entry-image-wrapper';

      image.classList.add('archive-entry-image');

      const button = doc.createElement('button');
      button.type = 'button';
      button.className = 'archive-entry-image-delete';
      button.setAttribute('data-delete-image-src', image.getAttribute('src') || '');
      button.setAttribute('data-delete-image-index', String(index));
      button.setAttribute('aria-label', 'Delete image');
      button.textContent = '×';

      image.parentNode?.insertBefore(wrapper, image);
      wrapper.appendChild(image);
      wrapper.appendChild(button);
    });

    return doc.body.innerHTML;
  };

  const handleContentClick = async (entry, event) => {
    const deleteButton = event.target.closest('[data-delete-image-src]');

    if (!deleteButton) {
      return;
    }

    event.preventDefault();

    const imageSrc = deleteButton.getAttribute('data-delete-image-src');
    const imageIndex = Number(deleteButton.getAttribute('data-delete-image-index') || '-1');

    if (!imageSrc) {
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(entry.content, 'text/html');
      const images = [...doc.querySelectorAll('img')];
      const imageToRemove = images.find((image, index) => image.getAttribute('src') === imageSrc && index === imageIndex)
        || images.find((image) => image.getAttribute('src') === imageSrc);

      if (!imageToRemove) {
        toast.error('Image not found in this entry');
        return;
      }

      const imageParent = imageToRemove.parentElement;
      imageToRemove.remove();

      if (
        imageParent &&
        ['P', 'DIV', 'FIGURE'].includes(imageParent.tagName) &&
        imageParent.textContent?.trim() === '' &&
        imageParent.querySelectorAll('img').length === 0
      ) {
        imageParent.remove();
      }

      await updateEntry(entry.id, {
        title: entry.title,
        content: doc.body.innerHTML,
        imageUrl: entry.imageUrl ?? null,
        mood: entry.mood,
      });
      await fetchEntries({ force: true });
      toast.success('Image removed');
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove image');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="py-4">
        <Link
          to="/dashboard"
          className="text-md cursor-pointer text-orange-600 hover:text-orange-700 dark:text-[#e0b38f] dark:hover:text-[#f3c69c]"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="gradient-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
        Look back at your archives <Mails className="inline-block size-7 text-orange-500 sm:size-8" />
      </h1>

      <div className="mt-6 flex flex-col gap-8 xl:flex-row xl:items-start">
        <ul className="flex min-w-0 flex-1 flex-col gap-4">
          {loading ? <BarLoader color="orange" width="100%" /> : null}

          {entries.length > 0 ? (
            <>
              {paginatedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="w-full rounded-2xl border border-pink-300 bg-gradient-to-br from-white/100 to-white/50 p-4 shadow-lg backdrop-blur-md sm:p-6 dark:border-[#52362d] dark:bg-[linear-gradient(135deg,rgba(42,29,24,0.96),rgba(31,22,19,0.92))] dark:shadow-[0_20px_48px_rgba(7,4,3,0.42)]"
                >
                  <li className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-xl font-extrabold text-black sm:text-2xl dark:text-[#f3e6d6]">{entry.title}</h1>
                      <h6 className="mt-1 text-xs font-bold text-black dark:text-[#c7a895]">
                        {new Date(entry.updatedAt).toLocaleString('en-US', dateOptions)}
                      </h6>
                      <label className="mt-4 block font-bold text-black dark:text-[#eddcc9]">
                        Mood :
                        <span className="ml-1 inline-block text-md font-semibold italic text-orange-700 dark:text-[#efad82]">
                          {entry.mood}
                        </span>
                      </label>
                      <div
                        className="archive-entry-content mt-3 text-balance break-words text-black dark:text-[#eadbca]"
                        dangerouslySetInnerHTML={{ __html: getArchiveContentHtml(entry.content) }}
                        onClick={(event) => handleContentClick(entry, event)}
                      />
                      {entry.imageUrl ? (
                        <div className={IMAGE_CARD_CLASS}>
                          <div className="aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-white shadow-inner dark:bg-[#1d1411]">
                            <img
                              src={entry.imageUrl}
                              alt={entry.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-orange-700/70 dark:text-[#cfa68a]">
                            Attached memory
                          </p>
                        </div>
                      ) : null}
                      {entry.aiReply ? (
                        <label className="mt-5 block font-bold text-black dark:text-[#eddcc9]">
                          Reflection :
                          <div
                            className="mt-2 break-words text-orange-700 dark:text-[#efbc95]"
                            dangerouslySetInnerHTML={{ __html: entry.aiReply }}
                          />
                        </label>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:w-auto lg:flex-col lg:items-end">
                      <button
                        onClick={() => navigate(`/update-entry/${entry.id}`)}
                        disabled={isDisabled}
                        className="rounded-lg p-1 transition hover:bg-orange-100 dark:hover:bg-[#35231c]"
                      >
                        <SquarePen color="#cf6017" className="h-5 w-5 sm:h-7 sm:w-7 cursor-pointer" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="rounded-lg p-1 transition hover:bg-orange-100 dark:hover:bg-[#35231c]"
                      >
                        <Trash2 color="#cf6017" className="h-5 w-5 sm:h-7 sm:w-7 cursor-pointer" />
                      </button>
                      <div className="flex items-center justify-center rounded-2xl">
                        <Button
                          variant="journal"
                          className="h-10 px-3 sm:px-4"
                          onClick={() => {
                            navigate(`/reflect/${entry.id}`, { state: { entry } });
                          }}
                        >
                          <Sparkles color="#ffffff" className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                </div>
              ))}

              {entries.length > ENTRIES_PER_PAGE ? (
                <div className="mt-2 flex flex-col items-center gap-3 rounded-2xl border border-orange-200/70 bg-white/60 px-3 py-3 sm:px-4 sm:py-4 shadow-sm sm:flex-row sm:justify-between dark:border-[#4c3227] dark:bg-[#241916]/85 dark:shadow-[0_14px_36px_rgba(8,4,3,0.32)]">
                  <p className="text-sm font-medium text-orange-900/75 dark:text-[#dfc1ab]">
                    Showing {(currentPage - 1) * ENTRIES_PER_PAGE + 1}-
                    {Math.min(currentPage * ENTRIES_PER_PAGE, entries.length)} of {entries.length} entries
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-800 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#5b3b2c] dark:bg-[#31211b] dark:text-[#f0d6bc] dark:hover:bg-[#3b2821]"
                    >
                      Previous
                    </button>
                    <div className="rounded-full bg-orange-100/80 px-4 py-2 text-sm font-semibold text-orange-900 dark:bg-[#4b3126] dark:text-[#f3dbc4]">
                      Page {currentPage} of {totalPages}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-800 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#5b3b2c] dark:bg-[#31211b] dark:text-[#f0d6bc] dark:hover:bg-[#3b2821]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <h3 className="mt-10 text-center text-gray-600">No enteries found.</h3>
          )}
        </ul>

        <div className="hidden xl:flex xl:w-[380px] xl:shrink-0 xl:flex-col xl:items-center 2xl:w-[430px]">
          <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
            {entries.length > 0 ? <img src={ticket} className="block h-auto w-full object-cover" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archives;
