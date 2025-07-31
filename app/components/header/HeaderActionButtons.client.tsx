import { useStore } from '@nanostores/react';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';

interface HeaderActionButtonsProps {}

export function HeaderActionButtons({}: HeaderActionButtonsProps) {
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const { showChat } = useStore(chatStore);

  const canHideChat = showWorkbench || !showChat;

  return (
    <div className="flex">
      <div className="flex dragondev-card border-dragondev-elements-borderColor rounded-xl overflow-hidden backdrop-blur-xl">
        <Button
          active={showChat}
          disabled={!canHideChat}
          onClick={() => {
            if (canHideChat) {
              chatStore.setKey('showChat', !showChat);
            }
          }}
        >
          <div className="i-ph:chat-circle-duotone text-lg" />
          <span className="hidden sm:inline">Chat</span>
        </Button>
        <div className="w-[1px] bg-dragondev-elements-borderColor" />
        <Button
          active={showWorkbench}
          onClick={() => {
            if (showWorkbench && !showChat) {
              chatStore.setKey('showChat', true);
            }

            workbenchStore.showWorkbench.set(!showWorkbench);
          }}
        >
          <div className="i-ph:code-bold text-lg" />
          <span className="hidden sm:inline">Forge</span>
        </Button>
      </div>
    </div>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  children?: any;
  onClick?: VoidFunction;
}

function Button({ active = false, disabled = false, children, onClick }: ButtonProps) {
  return (
    <button
      className={classNames('flex items-center gap-2 px-4 py-2 transition-all duration-200 font-medium', {
        'bg-dragondev-elements-item-backgroundDefault hover:bg-dragondev-elements-item-backgroundActive text-dragondev-elements-textTertiary hover:text-dragondev-elements-textPrimary':
          !active,
        'bg-gradient-to-r from-dragon-500 to-fire-500 text-white shadow-lg': active && !disabled,
        'bg-dragondev-elements-item-backgroundDefault text-dragondev-elements-textTertiary opacity-50 cursor-not-allowed':
          disabled,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}