import { memo } from 'react';
import { classNames } from '~/utils/classNames';

interface PanelHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const PanelHeader = memo(({ className, children }: PanelHeaderProps) => {
  return (
    <div
      className={classNames(
        'flex items-center gap-3 bg-dragondev-elements-background-depth-2/50 backdrop-blur-xl text-dragondev-elements-textSecondary border-b border-dragondev-elements-borderColor px-6 py-3 min-h-[44px] text-sm font-medium',
        className,
      )}
    >
      {children}
    </div>
  );
});