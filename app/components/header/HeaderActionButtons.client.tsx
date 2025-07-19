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
      <div className="flex devloop-card border-devloop-elements-borderColor rounded-xl overflow-hidden backdrop-blur-xl">
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
        <div className="w-[1px] bg-devloop-elements-borderColor" />
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
          <span className="hidden sm:inline">Code</span>
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
        'bg-devloop-elements-item-backgroundDefault hover:bg-devloop-elements-item-backgroundActive text-devloop-elements-textTertiary hover:text-devloop-elements-textPrimary':
          !active,
        'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg': active && !disabled,
        'bg-devloop-elements-item-backgroundDefault text-devloop-elements-textTertiary opacity-50 cursor-not-allowed':
          disabled,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}