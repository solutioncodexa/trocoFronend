import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'> & {
  wrapperClassName?: string;
};

export function PasswordInput({ className, wrapperClassName, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={cn('relative', wrapperClassName)}>
      <Input
        {...props}
        type={show ? 'text' : 'password'}
        className={cn('pr-10', className)}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
