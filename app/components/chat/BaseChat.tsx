import type { Message } from 'ai';
import React, { type RefCallback } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { Menu } from '~/components/sidebar/Menu.client';
import { IconButton } from '~/components/ui/IconButton';
import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';
import { Messages } from './Messages.client';
import { SendButton } from './SendButton.client';

import styles from './BaseChat.module.scss';

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
}

const EXAMPLE_PROMPTS = [
  { text: 'Forge a modern React dashboard with charts', icon: 'i-ph:chart-bar-duotone' },
  { text: 'Create a Next.js blog with Tailwind CSS', icon: 'i-ph:article-duotone' },
  { text: 'Design a responsive landing page', icon: 'i-ph:layout-duotone' },
  { text: 'Build a real-time chat application', icon: 'i-ph:chat-circle-duotone' },
  { text: 'Create a REST API with Node.js', icon: 'i-ph:code-duotone' },
];

const TEXTAREA_MIN_HEIGHT = 84;

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 240;

    return (
      <div
        ref={ref}
        className={classNames(
          styles.BaseChat,
          'relative flex h-full w-full overflow-hidden',
        )}
        data-chat-visible={showChat}
      >
        <ClientOnly>{() => <Menu />}</ClientOnly>
        <div ref={scrollRef} className="flex overflow-y-auto w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full')}>
            {!chatStarted && (
              <div id="intro" className="mt-[20vh] max-w-chat mx-auto px-6">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-dragon-500 to-fire-500 mb-6 shadow-2xl">
                    <div className="i-ph:lightning-bold text-white text-3xl" />
                  </div>
                  <h1 className="text-6xl font-bold dragondev-gradient-text mb-4">
                    Welcome to DragonDev
                  </h1>
                  <p className="text-xl text-dragondev-elements-textSecondary max-w-2xl mx-auto leading-relaxed">
                    Where code breathes fire. Forge legendary applications with the power of AI.
                  </p>
                </div>
              </div>
            )}
            <div
              className={classNames('pt-6 px-6', {
                'h-full flex flex-col': chatStarted,
              })}
            >
              <ClientOnly>
                {() => {
                  return chatStarted ? (
                    <Messages
                      ref={messageRef}
                      className="flex flex-col w-full flex-1 max-w-chat px-4 pb-6 mx-auto z-1"
                      messages={messages}
                      isStreaming={isStreaming}
                    />
                  ) : null;
                }}
              </ClientOnly>
              <div
                className={classNames('relative w-full max-w-chat mx-auto z-prompt', {
                  'sticky bottom-0': chatStarted,
                })}
              >
                <div
                  className={classNames(
                    'dragondev-card border-dragondev-elements-borderColor bg-dragondev-elements-prompt-background backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl',
                  )}
                >
                  <textarea
                    ref={textareaRef}
                    className={`w-full pl-6 pt-6 pr-20 focus:outline-none resize-none text-lg text-dragondev-elements-textPrimary placeholder-dragondev-elements-textTertiary bg-transparent font-medium`}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        if (event.shiftKey) {
                          return;
                        }

                        event.preventDefault();

                        sendMessage?.(event);
                      }
                    }}
                    value={input}
                    onChange={(event) => {
                      handleInputChange?.(event);
                    }}
                    style={{
                      minHeight: TEXTAREA_MIN_HEIGHT,
                      maxHeight: TEXTAREA_MAX_HEIGHT,
                    }}
                    placeholder="Describe what you want to forge..."
                    translate="no"
                  />
                  <ClientOnly>
                    {() => (
                      <SendButton
                        show={input.length > 0 || isStreaming}
                        isStreaming={isStreaming}
                        onClick={(event) => {
                          if (isStreaming) {
                            handleStop?.();
                            return;
                          }

                          sendMessage?.(event);
                        }}
                      />
                    )}
                  </ClientOnly>
                  <div className="flex justify-between items-center text-sm p-6 pt-3">
                    <div className="flex gap-2 items-center">
                      <IconButton
                        title="Enhance prompt with AI"
                        disabled={input.length === 0 || enhancingPrompt}
                        className={classNames('dragondev-button-secondary text-sm px-3 py-2', {
                          'opacity-100!': enhancingPrompt,
                          'bg-gradient-to-r from-ember-500/20 to-dragon-500/20 text-ember-400 border-ember-500/30': promptEnhanced,
                        })}
                        onClick={() => enhancePrompt?.()}
                      >
                        {enhancingPrompt ? (
                          <>
                            <div className="i-svg-spinners:90-ring-with-bg text-dragondev-elements-loader-progress text-lg"></div>
                            <span className="ml-2 font-medium">Enhancing...</span>
                          </>
                        ) : (
                          <>
                            <div className="i-ph:magic-wand-duotone text-lg"></div>
                            {promptEnhanced && <span className="ml-2 font-medium">Enhanced</span>}
                          </>
                        )}
                      </IconButton>
                    </div>
                    {input.length > 3 ? (
                      <div className="text-xs text-dragondev-elements-textTertiary flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-dragondev-elements-code-background text-dragondev-elements-code-text rounded font-mono text-xs">Shift</kbd>
                        <span>+</span>
                        <kbd className="px-2 py-1 bg-dragondev-elements-code-background text-dragondev-elements-code-text rounded font-mono text-xs">Enter</kbd>
                        <span>for new line</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="bg-transparent pb-6">{/* Ghost Element */}</div>
              </div>
            </div>
            {!chatStarted && (
              <div id="examples" className="relative w-full max-w-4xl mx-auto mt-12 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 [mask-image:linear-gradient(to_bottom,black_0%,transparent_200%)] hover:[mask-image:none]">
                  {EXAMPLE_PROMPTS.map((examplePrompt, index) => {
                    return (
                      <button
                        key={index}
                        onClick={(event) => {
                          sendMessage?.(event, examplePrompt.text);
                        }}
                        className="group dragondev-card p-6 text-left hover:scale-105 transition-all duration-300 hover:shadow-xl border-dragondev-elements-borderColor hover:border-dragon-500/30"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-dragon-500/20 to-fire-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-dragon-500/30 group-hover:to-fire-500/30 transition-all duration-300">
                            <div className={classNames(examplePrompt.icon, 'text-dragon-400 text-lg')} />
                          </div>
                          <div className="flex-1">
                            <p className="text-dragondev-elements-textPrimary font-medium group-hover:text-dragon-400 transition-colors duration-300">
                              {examplePrompt.text}
                            </p>
                          </div>
                          <div className="i-ph:arrow-right text-dragondev-elements-textTertiary group-hover:text-dragon-400 transition-colors duration-300 opacity-0 group-hover:opacity-100" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <ClientOnly>{() => <Workbench chatStarted={chatStarted} isStreaming={isStreaming} />}</ClientOnly>
        </div>
      </div>
    );
  },
);