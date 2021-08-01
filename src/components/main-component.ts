export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  template: HTMLTemplateElement;
  host: T;
  element: U;

  constructor(
    templateId: string,
    hostId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.template = <HTMLTemplateElement>(
      document.querySelector(`#${templateId}`)
    );
    this.host = <T>document.querySelector(`#${hostId}`);
    const importedForm = document.importNode(this.template.content, true);
    this.element = importedForm.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.host.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract config(): void;
  abstract renderContent(): void;
}
