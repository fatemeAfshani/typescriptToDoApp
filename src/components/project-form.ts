import { Component } from "./main-component.js";
import { validator, Validatable } from "../utils/validation.js";
import { stateInstance } from "../state/project-state.js";
import { AutoBind } from "../decorator/autoBind.js";

export class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
  titleEl: HTMLInputElement;
  descriptionEl: HTMLInputElement;
  peopleEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleEl = <HTMLInputElement>this.element.querySelector("#title");
    this.descriptionEl = <HTMLInputElement>(
      this.element.querySelector("#description")
    );
    this.peopleEl = <HTMLInputElement>this.element.querySelector("#people");

    this.config();
  }

  config() {
    // this.formElement.addEventListener("submit", this.formListener.bind(this));
    this.element.addEventListener("submit", this.formListener);
  }
  renderContent() {}
  private getInputDatas(): [string, string, number] | void {
    const title = this.titleEl.value;
    const description = this.descriptionEl.value;
    const people = this.peopleEl.value;
    const titleValidate: Validatable = {
      value: title,
      required: true,
    };
    const descriptionValidate: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    const peopleValidate: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 5,
    };
    if (
      !validator(titleValidate) ||
      !validator(descriptionValidate) ||
      !validator(peopleValidate)
    ) {
      alert("some thing wrong, enter right data");
    } else {
      return [title, description, +people];
    }
  }

  private clearInputs() {
    this.titleEl.value = "";
    this.descriptionEl.value = "";
    this.peopleEl.value = "";
  }

  @AutoBind
  private formListener(event: Event) {
    event.preventDefault();
    const inputs = this.getInputDatas();
    if (Array.isArray(inputs)) {
      const [title, description, people] = inputs;
      stateInstance.addProject(title, description, people);
    }
    this.clearInputs();
  }
}
