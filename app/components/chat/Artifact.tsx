import { useStore } from '@nanostores/react';
import { AnimatePresence, motion } from 'framer-motion';
import { computed } from 'nanostores';
import { memo, useEffect, useRef, useState } from 'react';
import { createHighlighter, type BundledLanguage, type BundledTheme, type HighlighterGeneric } from 'shiki';
import type { ActionState } from '~/lib/runtime/action-runner';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';

const highlighterOptions = {
  langs: ['shell'],
  themes: ['github-light', 'github-dark'],
};

const shellHighlighter: HighlighterGeneric<BundledLanguage, BundledTheme> =
  import.meta.hot?.data.shellHighlighter ?? (await createHighlighter(highlighterOptions));

if (import.meta.hot) {
  import.meta.hot.data.shellHighlighter = shellHighlighter;
}

interface ArtifactProps {
  messageId: string;
}

export const Artifact = memo(({ messageId }: ArtifactProps) => {
  const userToggledActions = useRef(false);
  const [showActions, setShowActions] = useState(false);

  const artifacts = useStore(workbenchStore.artifacts);
  const artifact = artifacts[messageId];

  const actions = useStore(
    computed(artifact.runner.actions, (actions) => {
      return Object.values(actions);
    }),
  );

  const toggleActions = () => {
    userToggledActions.current = true;
    setShowActions(!showActions);
  };

  useEffect(() => {
    if (actions.length && !showActions && !userToggledActions.current) {
      setShowActions(true);
    }
  }, [actions]);

  return (
    <div className="artifact dragondev-card border-dragondev-elements-artifacts-borderColor flex flex-col overflow-hidden rounded-xl w-full transition-all duration-200 hover:shadow-xl">
      <div className="flex">
        <button
          className="flex items-stretch bg-dragondev-elements-artifacts-background hover:bg-dragondev-elements-artifacts-backgroundHover w-full overflow-hidden transition-all duration-200 hover:scale-[1.02]"
          onClick={() => {
            const showWorkbench = workbenchStore.showWorkbench.get();
            workbenchStore.showWorkbench.set(!showWorkbench);
          }}
        >
          <div className="px-6 py-4 w-full text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dragon-500 to-fire-500 flex items-center justify-center">
                <div className="i-ph:code-bold text-white text-sm" />
              </div>
              <div className="w-full text-dragondev-elements-textPrimary font-semibold leading-5 text-lg">{artifact?.title}</div>
            </div>
            <div className="w-full text-dragondev-elements-textSecondary text-sm flex items-center gap-2">
              <div className="i-ph:cursor-click-duotone" />
              Click to open in Dragon Forge
            </div>
          </div>
        </button>
        <div className="bg-dragondev-elements-artifacts-borderColor w-[1px]" />
        <AnimatePresence>
          {actions.length && (
            <motion.button
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              exit={{ width: 0 }}
              transition={{ duration: 0.15, ease: cubicEasingFn }}
              className="bg-dragondev-elements-artifacts-background hover:bg-dragondev-elements-artifacts-backgroundHover transition-all duration-200"
              onClick={toggleActions}
            >
              <div className="p-4 flex items-center gap-2">
                <div className={classNames('transition-transform duration-200', showActions ? 'i-ph:caret-up-bold' : 'i-ph:caret-down-bold')}></div>
                <span className="text-sm font-medium text-dragondev-elements-textSecondary">Actions</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showActions && actions.length > 0 && (
          <motion.div
            className="actions"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: '0px' }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-dragondev-elements-artifacts-borderColor h-[1px]" />
            <div className="p-6 text-left bg-dragondev-elements-actions-background">
              <ActionList actions={actions} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

interface ShellCodeBlockProps {
  classsName?: string;
  code: string;
}

function ShellCodeBlock({ classsName, code }: ShellCodeBlockProps) {
  return (
    <div
      className={classNames('text-xs font-mono', classsName)}
      dangerouslySetInnerHTML={{
        __html: shellHighlighter.codeToHtml(code, {
          lang: 'shell',
          theme: 'github-dark',
        }),
      }}
    ></div>
  );
}

interface ActionListProps {
  actions: ActionState[];
}

const actionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ActionList = memo(({ actions }: ActionListProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      <ul className="list-none space-y-3">
        {actions.map((action, index) => {
          const { status, type, content } = action;
          const isLast = index === actions.length - 1;

          return (
            <motion.li
              key={index}
              variants={actionVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.2,
                ease: cubicEasingFn,
              }}
            >
              <div className="flex items-center gap-3 text-sm">
                <div className={classNames('text-lg flex-shrink-0', getIconColor(action.status))}>
                  {status === 'running' ? (
                    <div className="i-svg-spinners:90-ring-with-bg"></div>
                  ) : status === 'pending' ? (
                    <div className="i-ph:circle-duotone"></div>
                  ) : status === 'complete' ? (
                    <div className="i-ph:check-circle-duotone"></div>
                  ) : status === 'failed' || status === 'aborted' ? (
                    <div className="i-ph:x-circle-duotone"></div>
                  ) : null}
                </div>
                {type === 'file' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-dragondev-elements-textSecondary">Create</span>
                    <code className="bg-dragondev-elements-artifacts-inlineCode-background text-dragondev-elements-artifacts-inlineCode-text px-2 py-1 rounded-lg font-mono text-xs">
                      {action.filePath}
                    </code>
                  </div>
                ) : type === 'shell' ? (
                  <div className="flex items-center w-full min-h-[32px]">
                    <span className="flex-1 font-medium text-dragondev-elements-textPrimary">Execute command</span>
                  </div>
                ) : null}
              </div>
              {type === 'shell' && (
                <div className="ml-6">
                  <ShellCodeBlock
                    classsName={classNames('mt-2 rounded-lg overflow-hidden', {
                      'mb-4': !isLast,
                    })}
                    code={content}
                  />
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
});

function getIconColor(status: ActionState['status']) {
  switch (status) {
    case 'pending': {
      return 'text-dragondev-elements-textTertiary';
    }
    case 'running': {
      return 'text-dragondev-elements-loader-progress';
    }
    case 'complete': {
      return 'text-dragondev-elements-icon-success';
    }
    case 'aborted': {
      return 'text-dragondev-elements-textSecondary';
    }
    case 'failed': {
      return 'text-dragondev-elements-icon-error';
    }
    default: {
      return undefined;
    }
  }
}