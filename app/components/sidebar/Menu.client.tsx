import { motion, type Variants } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { IconButton } from '~/components/ui/IconButton';
import { ThemeSwitch } from '~/components/ui/ThemeSwitch';
import { db, deleteById, getAll, chatId, type ChatHistoryItem } from '~/lib/persistence';
import { cubicEasingFn } from '~/utils/easings';
import { logger } from '~/utils/logger';
import { HistoryItem } from './HistoryItem';
import { binDates } from './date-binning';

const menuVariants = {
  closed: {
    opacity: 0,
    visibility: 'hidden',
    left: '-200px',
    transition: {
      duration: 0.3,
      ease: cubicEasingFn,
    },
  },
  open: {
    opacity: 1,
    visibility: 'initial',
    left: 0,
    transition: {
      duration: 0.3,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

type DialogContent = { type: 'delete'; item: ChatHistoryItem } | null;

export function Menu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<ChatHistoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContent>(null);

  const loadEntries = useCallback(() => {
    if (db) {
      getAll(db)
        .then((list) => list.filter((item) => item.urlId && item.description))
        .then(setList)
        .catch((error) => toast.error(error.message));
    }
  }, []);

  const deleteItem = useCallback((event: React.UIEvent, item: ChatHistoryItem) => {
    event.preventDefault();

    if (db) {
      deleteById(db, item.id)
        .then(() => {
          loadEntries();

          if (chatId.get() === item.id) {
            // hard page navigation to clear the stores
            window.location.pathname = '/';
          }
        })
        .catch((error) => {
          toast.error('Failed to delete conversation');
          logger.error(error);
        });
    }
  }, []);

  const closeDialog = () => {
    setDialogContent(null);
  };

  useEffect(() => {
    if (open) {
      loadEntries();
    }
  }, [open]);

  useEffect(() => {
    const enterThreshold = 50;
    const exitThreshold = 50;

    function onMouseMove(event: MouseEvent) {
      if (event.pageX < enterThreshold) {
        setOpen(true);
      }

      if (menuRef.current && event.clientX > menuRef.current.getBoundingClientRect().right + exitThreshold) {
        setOpen(false);
      }
    }

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={menuRef}
      initial="closed"
      animate={open ? 'open' : 'closed'}
      variants={menuVariants}
      className="flex flex-col side-menu fixed top-0 w-[400px] h-full devloop-card border-devloop-elements-borderColor border-r rounded-r-3xl z-sidebar shadow-2xl text-sm backdrop-blur-xl"
    >
      <div className="flex items-center h-[var(--header-height)] px-6 border-b border-devloop-elements-borderColor">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <div className="i-ph:code-bold text-white text-lg" />
          </div>
          <span className="text-xl font-bold devloop-gradient-text">DevLoop</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <div className="p-6">
          <a
            href="/"
            className="flex gap-3 items-center devloop-button-primary rounded-xl p-4 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="inline-block i-ph:plus-circle-bold text-xl" />
            <span className="font-semibold">Start New Project</span>
          </a>
        </div>
        <div className="text-devloop-elements-textPrimary font-semibold pl-6 pr-5 mb-4 flex items-center gap-2">
          <div className="i-ph:clock-duotone text-lg" />
          Recent Projects
        </div>
        <div className="flex-1 overflow-scroll pl-6 pr-5 pb-5">
          {list.length === 0 && (
            <div className="pl-2 text-devloop-elements-textTertiary text-center py-8">
              <div className="i-ph:folder-open-duotone text-4xl mb-3 opacity-50" />
              <p>No previous projects</p>
            </div>
          )}
          <DialogRoot open={dialogContent !== null}>
            {binDates(list).map(({ category, items }) => (
              <div key={category} className="mb-6 first:mt-0 space-y-2">
                <div className="text-devloop-elements-textTertiary sticky top-0 z-1 bg-devloop-elements-background-depth-2/80 backdrop-blur-xl pl-2 pt-2 pb-2 rounded-lg font-medium">
                  {category}
                </div>
                {items.map((item) => (
                  <HistoryItem key={item.id} item={item} onDelete={() => setDialogContent({ type: 'delete', item })} />
                ))}
              </div>
            ))}
            <Dialog onBackdrop={closeDialog} onClose={closeDialog}>
              {dialogContent?.type === 'delete' && (
                <>
                  <DialogTitle>Delete Project?</DialogTitle>
                  <DialogDescription asChild>
                    <div>
                      <p>
                        You are about to delete <strong>{dialogContent.item.description}</strong>.
                      </p>
                      <p className="mt-1">Are you sure you want to delete this project?</p>
                    </div>
                  </DialogDescription>
                  <div className="px-5 pb-4 bg-devloop-elements-background-depth-2 flex gap-2 justify-end">
                    <DialogButton type="secondary" onClick={closeDialog}>
                      Cancel
                    </DialogButton>
                    <DialogButton
                      type="danger"
                      onClick={(event) => {
                        deleteItem(event, dialogContent.item);
                        closeDialog();
                      }}
                    >
                      Delete
                    </DialogButton>
                  </div>
                </>
              )}
            </Dialog>
          </DialogRoot>
        </div>
        <div className="flex items-center border-t border-devloop-elements-borderColor p-6 bg-devloop-elements-background-depth-2/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 flex-1">
            <div className="i-ph:gear-duotone text-lg text-devloop-elements-textSecondary" />
            <span className="text-devloop-elements-textSecondary font-medium">Settings</span>
          </div>
          <ThemeSwitch className="ml-auto" />
        </div>
      </div>
    </motion.div>
  );
}