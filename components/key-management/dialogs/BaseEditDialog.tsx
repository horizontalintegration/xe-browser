import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PropsWithChildren, useState } from "react";
import { Alert } from "@/components/helpers/Alert";

export interface BaseEditDialogProps extends PropsWithChildren {
  title: string;
  description: string;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  deleteButtonText: string;
  deleteConfirmTitle: string;
  deleteConfirmDescription: string;
  saveButtonText: string;
};
const BaseEditDialog = ({
  title,
  description,
  onCancel,
  onSave,
  onDelete,
  deleteButtonText,
  deleteConfirmTitle,
  deleteConfirmDescription,
  saveButtonText,
  children
}: BaseEditDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <div>
          {children}
        </div>
        <DialogFooter>
          <Alert
            triggerButton={
              <Button variant={"destructive"}>{deleteButtonText}</Button>
            }
            alertType="confirm"
            title={deleteConfirmTitle}
            description={deleteConfirmDescription}
            onConfirm={() => onDelete()}
          ></Alert>
          <Button type="reset" variant="outline" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button type="submit">{saveButtonText}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default BaseEditDialog;
