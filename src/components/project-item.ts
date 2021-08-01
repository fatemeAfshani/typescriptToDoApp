import { Component } from "./main-component.js";
import { Project } from "../models/project.js";
import { AutoBind } from "../decorator/autoBind.js";
import { Draggable } from "../models/drag-drop.js";

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLinkElement>
  implements Draggable
{
  private project: Project;
  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;
    this.config();
    this.renderContent();
  }

  get perons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }
  @AutoBind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler(_: DragEvent) {}

  config() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }
  renderContent() {
    this.element.querySelector("h2")!.innerText = this.project.title;
    this.element.querySelector("h3")!.innerText = this.perons + " attached";
    this.project.people.toString();
    this.element.querySelector("p")!.innerText = this.project.description;
  }
}
