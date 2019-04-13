import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {isLoading$} from '../loading-indicator.decorators';
import {LOADING_INDICATOR_CONFIG} from '../loading-indicator.config';
import {LoadingIndicatorConfig} from '../interfaces/loading-indicator.interfaces';

@Component({
  selector: 'btp-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent implements OnInit, OnDestroy {
  @ViewChild('focusTrap')
  focusTrap: ElementRef;
  private isLoadingSub: Subscription;
  private previousFocusTarget: HTMLElement;
  private nextFocusTarget: HTMLElement;

  constructor(@Inject(LOADING_INDICATOR_CONFIG)
              private config: LoadingIndicatorConfig) {
  }

  get isLoading$(): Observable<boolean> {
    return isLoading$;
  }

  get indicatorSize(): string {
    return `${this.config.size}px`;
  }

  ngOnInit(): void {
    this.isLoadingSub = this.isLoading$
      .subscribe((isLoading: boolean) => {
        if (isLoading) {
          this.trapFocus();
        } else {
          this.restoreFocus();
        }
      });
  }

  ngOnDestroy(): void {
    this.isLoadingSub.unsubscribe();
  }

  disableKeyboardEvents(event: FocusEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.nextFocusTarget.focus();
  }

  private trapFocus(): void {
    this.previousFocusTarget = document.activeElement as HTMLElement;
    if (this.previousFocusTarget) {
      this.previousFocusTarget.blur();
    }
    this.nextFocusTarget = this.focusTrap.nativeElement;
    this.nextFocusTarget.focus();
  }

  private restoreFocus(): void {
    if (this.previousFocusTarget) {
      this.nextFocusTarget = this.previousFocusTarget;
      this.nextFocusTarget.focus();
    }
  }
}
