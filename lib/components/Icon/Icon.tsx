import { icons } from 'lucide-react';
import React from 'react';

interface IconProps extends React.HTMLAttributes<SVGElement> {
  name: string;
  color?: string;
  size?: number;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, color, size, ...props }, ref) => {
    const LucideIcon = icons[name as keyof typeof icons];

    if (!LucideIcon) {
      return null;
    }

    return <LucideIcon ref={ref} color={color} size={size} {...props} />;
  },
);
Icon.displayName = 'Icon';
