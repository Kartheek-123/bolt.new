import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames(
        'flex items-center bg-devloop-elements-background-depth-1 backdrop-blur-xl p-6 border-b h-[var(--header-height)] relative',
        {
          'border-transparent': !chat.started,
          'border-devloop-elements-borderColor': chat.started,
        },
      )}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-secondary-500/5 to-accent-500/5 pointer-events-none" />
      
      <div className="flex items-center gap-3 z-logo text-devloop-elements-textPrimary cursor-pointer relative">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
          <div className="i-ph:code-bold text-white text-lg" />
        </div>
        <a href="/" className="text-2xl font-bold devloop-gradient-text flex items-center">
          DevLoop
        </a>
        <div className="px-2 py-1 bg-accent-500/20 text-accent-400 text-xs font-medium rounded-full border border-accent-500/30">
          BETA
        </div>
      </div>
      
      <span className="flex-1 px-6 truncate text-center text-devloop-elements-textPrimary font-medium">
        <ClientOnly>{() => <ChatDescription />}</ClientOnly>
      </span>
      
      {chat.started && (
        <ClientOnly>
          {() => (
            <div className="mr-1 relative">
              <HeaderActionButtons />
            </div>
          )}
        </ClientOnly>
      )}
    </header>
  );
}