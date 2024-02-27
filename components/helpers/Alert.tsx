'use client';
import { ReactElement, ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import { RenderIf } from './RenderIf';

export type AlertType = 'alert' | 'confirm';

export interface AlertProps extends AlertDialogProps {
  alertType: AlertType;
  title: ReactNode;
  description?: ReactNode;
  triggerButton?: ReactElement;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
  cancelText?: string;
  confirmText?: string;
}

export function Alert({
  alertType,
  title,
  description,
  triggerButton: trigger,
  onCancel,
  onConfirm,
  onClose,
  onOpenChange = (isOpen) => {
    if (!isOpen && onClose) {
      onClose();
    }
  },
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  ...props
}: AlertProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} {...props}>
      <RenderIf condition={!!trigger}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      </RenderIf>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <RenderIf condition={!!description}>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </RenderIf>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <RenderIf condition={alertType === 'confirm'}>
            <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          </RenderIf>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
