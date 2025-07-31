import type { Message } from 'ai';
import React from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [] } = props;

  return (
    <div id={id} ref={ref} className={props.className}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content } = message;
            const isUserMessage = role === 'user';
            const isFirst = index === 0;
            const isLast = index === messages.length - 1;

            return (
              <div
                key={index}
                className={classNames('flex gap-6 p-8 w-full rounded-2xl dragondev-card border-dragondev-elements-borderColor', {
                  'bg-dragondev-elements-messages-background backdrop-blur-xl': isUserMessage || !isStreaming || (isStreaming && !isLast),
                  'bg-gradient-to-b from-dragondev-elements-messages-background/80 from-30% to-transparent backdrop-blur-xl':
                    isStreaming && isLast,
                  'mt-6': !isFirst,
                })}
              >
                {isUserMessage && (
                  <div className="flex items-center justify-center w-[40px] h-[40px] overflow-hidden bg-gradient-to-br from-dragon-500 to-fire-500 text-white rounded-xl shrink-0 self-start shadow-lg">
                    <div className="i-ph:user-bold text-lg"></div>
                  </div>
                )}
                {!isUserMessage && (
                  <div className="flex items-center justify-center w-[40px] h-[40px] overflow-hidden bg-gradient-to-br from-ember-500 to-dragon-500 text-white rounded-xl shrink-0 self-start shadow-lg">
                    <div className="i-ph:lightning-bold text-lg"></div>
                  </div>
                )}
                <div className="grid grid-col-1 w-full">
                  {isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
                </div>
              </div>
            );
          })
        : null}
      {isStreaming && (
        <div className="text-center w-full text-dragondev-elements-textSecondary mt-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 dragondev-card border-dragondev-elements-borderColor">
            <div className="i-svg-spinners:3-dots-fade text-2xl text-dragon-400"></div>
            <span className="text-sm font-medium">DragonDev is forging...</span>
          </div>
        </div>
      )}
    </div>
  );
});