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
        'flex items-center bg-dragondev-elements-background-depth-1 backdrop-blur-xl p-6 border-b h-[var(--header-height)] relative',
        {
          'border-transparent': !chat.started,
          'border-dragondev-elements-borderColor': chat.started,
        },
      )}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dragon-500/10 via-fire-500/10 to-ember-500/10 pointer-events-none" />
      
      <div className="flex items-center gap-3 z-logo text-dragondev-elements-textPrimary cursor-pointer relative">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dragon-500 to-fire-500 flex items-center justify-center shadow-lg">
          <div className="i-ph:lightning-bold text-white text-lg" />
        </div>
        <a href="/" className="text-2xl font-bold dragondev-gradient-text flex items-center">
          DragonDev
        </a>
        <div className="px-2 py-1 bg-ember-500/20 text-ember-400 text-xs font-medium rounded-full border border-ember-500/30">
          LEGENDARY
        </div>
      </div>
      
      <span className="flex-1 px-6 truncate text-center text-dragondev-elements-textPrimary font-medium">
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