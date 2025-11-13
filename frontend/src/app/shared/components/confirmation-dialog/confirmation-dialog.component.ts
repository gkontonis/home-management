import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable confirmation dialog component.
 * Replaces browser's native confirm() with a styled DaisyUI modal.
 *
 * Usage:
 * <app-confirmation-dialog
 *   [isOpen]="showDialog()"
 *   title="Delete Todo"
 *   message="Are you sure you want to delete this todo?"
 *   confirmText="Delete"
 *   confirmButtonClass="btn-error"
 *   (confirmed)="onConfirmed()"
 *   (cancelled)="onCancelled()"
 * />
 */
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent {
  /**
   * Controls whether the dialog is visible
   */
  isOpen = input<boolean>(false);

  /**
   * Dialog title
   */
  title = input<string>('Confirm Action');

  /**
   * Dialog message/description
   */
  message = input<string>('Are you sure you want to proceed?');

  /**
   * Text for the confirm button
   */
  confirmText = input<string>('Confirm');

  /**
   * Text for the cancel button
   */
  cancelText = input<string>('Cancel');

  /**
   * DaisyUI button class for the confirm button
   * Examples: 'btn-primary', 'btn-error', 'btn-warning'
   */
  confirmButtonClass = input<string>('btn-primary');

  /**
   * Emitted when user clicks the confirm button
   */
  confirmed = output<void>();

  /**
   * Emitted when user clicks the cancel button or closes the dialog
   */
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
