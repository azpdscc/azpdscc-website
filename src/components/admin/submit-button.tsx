
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ActionSubmitButtonProps {
  isEditing: boolean;
  createText?: string;
  updateText?: string;
  className?: string;
  disabled?: boolean;
}

export function ActionSubmitButton({ isEditing, createText = "Create", updateText = "Update", className, disabled = false }: ActionSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} className={className}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isEditing ? updateText : createText}
    </Button>
  );
}
