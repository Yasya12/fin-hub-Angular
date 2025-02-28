import { Component, ElementRef, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { PostService } from '../../services/posts.service';
import { ResponseModel } from '../../../signup/models/response.model';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.css'],
})
export class PostEditorComponent {
  @Input() curretnUser!: ResponseModel | null;
  @Output() close = new EventEmitter<void>();
  @Output() contentValue = new EventEmitter<string>();
  @ViewChild('textInput') textInput!: ElementRef;
  editorForm = new FormGroup({
    content: new FormControl('') // Initialize with an empty string
  });


  modules = {
    toolbar: '#quillToolbar' // Attach the toolbar to an external div
  };

  private quill!: any;

  constructor(
    private postService: PostService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  focusInput() {
    this.textInput?.nativeElement?.focus();
  }

  closeModal() {
    this.close.emit();
  }

  onEditorCreated(quillInstance: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.quill = quillInstance;

      // Remove Quill tooltip
      const tooltip = document.querySelector('.ql-tooltip');
      if (tooltip) {
        tooltip.remove();
      }

      const toolbar = this.quill.getModule('toolbar');
      toolbar.addHandler('link', () => {
        const currentSelection = this.quill.getSelection();

        if (this.isCursorInsideLink()) return; // Prevent opening modal if inside a link

        this.openCustomModal().then((url: string) => {
          if (!url) return;

          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
          }

          let range = this.quill.getSelection() || currentSelection;

          if (range) {
            if (range.length > 0) {
              this.quill.format('link', url);
            } else {
              let index = range.index;
              const textBefore = this.quill.getText(index - 1, 1);

              // Додаємо пробіл перед посиланням, якщо його немає
              if (index > 0 && !textBefore.match(/\s/)) {
                this.quill.insertText(index, " ");
                index++; // Зсуваємо індекс на 1
              }

              // Вставляємо посилання
              this.quill.insertText(index, url, 'link', url);
              index += url.length;

              // **ВАЖЛИВО!** Знімаємо форматування перед вставкою пробілу
              this.quill.setSelection(index, 1); // Виділяємо місце після посилання
              this.quill.format('link', false); // Знімаємо форматування посилання

              this.quill.setSelection(index + 1);
            }
          }

          setTimeout(() => {
            this.quill.formatText(range.index, url.length, 'link', url);
          }, 10);

          this.editorForm.controls['content'].setValue(this.quill.root.innerHTML);
          this.quill.setSelection(this.quill.getLength());

          this.makeLinksClickable();
        });
      });
      
      // Apply event listener to make links clickable of initial content
      this.makeLinksClickable();
    }
  }

  private isCursorInsideLink(): boolean {
    const range = this.quill.getSelection();
    if (!range) return false;

    const index = range.index;
    const textLength = this.quill.getLength();

    // Get previous and next character
    const prevChar = index > 0 ? this.quill.getContents(index - 1, 1).ops[0] : null;
    const nextChar = index < textLength - 1 ? this.quill.getContents(index, 1).ops[0] : null;

    // Check if the previous or next character is part of a link
    const prevIsLink = prevChar?.attributes?.link;
    const nextIsLink = nextChar?.attributes?.link;

    return !!prevIsLink || !!nextIsLink;
  }

  private openCustomModal(): Promise<string> {
    return new Promise((resolve) => {
      const modal = document.getElementById("linkModal") as HTMLDivElement;
      const input = document.getElementById("linkInput") as HTMLInputElement;
      const submitButton = document.getElementById("linkSubmit") as HTMLButtonElement;
      const closeButton = document.getElementById("linkClose") as HTMLButtonElement;

      if (!modal || !input || !submitButton || !closeButton) {
        resolve("");
        return;
      }

      input.value = "";
      modal.style.display = "block";

      const inputHandler = () => {
        if (input.value.trim() === "") {
          closeButton.classList.remove("hidden");
          submitButton.classList.add("hidden");
        } else {
          closeButton.classList.add("hidden");
          submitButton.classList.remove("hidden");
        }
      };

      inputHandler();

      const submitHandler = () => {
        closeModal();
        resolve(input.value.trim());
      };

      const closeHandler = () => {
        closeModal();
        resolve("");
      };

      const outsideClickHandler = (event: MouseEvent) => {
        if (modal && !modal.contains(event.target as Node)) {
          closeModal();
          resolve("");
        }
      };

      const closeModal = () => {
        modal.style.display = "none";
        document.removeEventListener("click", outsideClickHandler);
        cleanup();
      };

      const cleanup = () => {
        submitButton.removeEventListener("click", submitHandler);
        closeButton.removeEventListener("click", closeHandler);
        input.removeEventListener("input", inputHandler);
      };

      // Add click listener only after the modal is open (delayed to prevent instant closing)
      setTimeout(() => {
        document.addEventListener("click", outsideClickHandler);
      }, 100);

      input.addEventListener("input", inputHandler);
      submitButton.addEventListener("click", submitHandler);
      closeButton.addEventListener("click", closeHandler);
    });
  }

  private makeLinksClickable() {
    setTimeout(() => {
      const editor = document.querySelector('.ql-editor');
      if (editor) {
        editor.querySelectorAll('a').forEach((link) => {
          link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default navigation

            // Open the link in a new tab with a feature string to ensure it doesn't replace the old one // Ensure new tab // Security best practice
            const newTab = window.open(link.href, '_blank', 'noopener,noreferrer');

            if (newTab) {
              newTab.focus();
            }
          });
        });
      }
    }, 1);
  }

  submitPost() {
    const contentValue = this.editorForm.value.content || '';
    console.log("child htlm" + contentValue)
    this.contentValue.emit(contentValue);
  }
}
