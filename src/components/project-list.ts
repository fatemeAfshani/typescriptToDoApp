import { Component } from "./main-component.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project } from "../models/project.js";
import { AutoBind } from "../decorator/autoBind.js";
import { ProjectStatus } from "../models/project.js";
import { stateInstance } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[] = [];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.config();
    this.renderContent();
  }
  renderContent() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
    this.element.querySelector("h2")!.innerText =
      this.type.toUpperCase() + " PROJECTS";
  }

  @AutoBind
  dragLeaveHandler(_: DragEvent) {
    const ulList = this.element.querySelector("ul")!;
    ulList.classList.remove("droppable");
  }

  @AutoBind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const ulList = this.element.querySelector("ul")!;
      ulList.classList.add("droppable");
    }
  }

  @AutoBind
  dropHandler(event: DragEvent) {
    const productId = event.dataTransfer!.getData("text/plain");
    stateInstance.moveProject(
      productId,
      this.type === "finished" ? ProjectStatus.Finished : ProjectStatus.Active
    );
  }

  config() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    stateInstance.addListener((projects: Project[]) => {
      const releventProjects = projects.filter((pro) => {
        if (this.type === "active") {
          return pro.status === ProjectStatus.Active;
        }
        return pro.status === ProjectStatus.Finished;
      });
      this.assignedProjects = releventProjects;
      this.renderProjects();
    });
  }
  private renderProjects() {
    const ulList = <HTMLUListElement>(
      document.querySelector(`#${this.type}-projects-list`)
    );
    ulList.innerHTML = "";
    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, project);
    }
  }
}
