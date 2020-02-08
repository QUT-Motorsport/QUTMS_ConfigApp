import {
  WorkspaceModel,
  WorkspaceEngine
} from "@projectstorm/react-workspaces";

export class DefaultWorkspacePanelModel extends WorkspaceModel {
  displayName: string;

  constructor(displayName: string) {
    super("default");
    this.displayName = displayName;
    this.setExpand(false, true);
  }

  toArray = () => ({
    ...super.toArray(),
    displayName: this.displayName
  });

  fromArray(payload: any, engine: WorkspaceEngine) {
    super.fromArray(payload, engine);
    this.displayName = payload["displayName"];
  }
}
