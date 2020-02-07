import {
  WorkspaceNodeModel,
  GenerateEvent,
  WorkspaceTrayFactory
} from "@projectstorm/react-workspaces";

export class DefaultTrayFactory extends WorkspaceTrayFactory {
  generateTrayHeader = (event: GenerateEvent<WorkspaceNodeModel>) => (
    <div
      style={{
        height: "15px",
        background: "mediumpurple"
      }}
      onDoubleClick={() => {
        event.model.setMode(event.model.mode === "micro" ? "expand" : "micro");
        event.engine.fireRepaintListeners();
      }}
    />
  );
}
