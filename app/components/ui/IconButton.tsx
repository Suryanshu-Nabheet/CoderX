import { memo, forwardRef, type ForwardedRef } from 'react';
import { classNames } from '~/utils/classNames';

type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface BaseIconButtonProps {
  size?: IconSize;
  className?: string;
  iconClassName?: string;
  disabledClassName?: string;
  title?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

type IconButtonWithoutChildrenProps = {
  icon: string;
  children?: undefined;
} & BaseIconButtonProps;

type IconButtonWithChildrenProps = {
  icon?: undefined;
  children: string | JSX.Element | JSX.Element[];
} & BaseIconButtonProps;

type IconButtonProps = IconButtonWithoutChildrenProps | IconButtonWithChildrenProps;

// Componente IconButton com suporte a refs
export const IconButton = memo(
  forwardRef(
    (
      {
        icon,
        size = 'xl',
        className,
        iconClassName,
        disabledClassName,
        disabled = false,
        title,
        onClick,
        children,
      }: IconButtonProps,
      ref: ForwardedRef<HTMLButtonElement>,
    ) => {
      return (
        <button
          ref={ref}
          className={classNames(
            'group relative p-2.5 rounded-lg border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-0 border-bolt-elements-borderColor/30 hover:border-bolt-elements-borderColor text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary',
            {
              [classNames('opacity-30', disabledClassName)]: disabled,
            },
            className,
          )}
          title={title}
          disabled={disabled}
          onClick={(event) => {
            if (disabled) {
              return;
            }

            onClick?.(event);
          }}
        >
          {children ? children : <div className={classNames(icon, getIconSize(size), iconClassName)}></div>}
        </button>
      );
    },
  ),
);

function getIconSize(size: IconSize) {
  if (size === 'sm') {
    return 'text-sm';
  } else if (size === 'md') {
    return 'text-md';
  } else if (size === 'lg') {
    return 'text-lg';
  } else if (size === 'xl') {
    return 'text-xl';
  } else {
    return 'text-2xl';
  }
}
