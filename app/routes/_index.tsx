import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';

export const meta: MetaFunction = () => {
  return [
    { title: 'DragonDev - AI-Powered Development Environment' }, 
    { name: 'description', content: 'DragonDev - Where code breathes fire. AI-powered development environment for legendary developers.' }
  ];
};

export const loader = () => json({});

export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-dragondev-bg-primary via-dragondev-bg-secondary to-dragondev-bg-tertiary">
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}