import {
  WorkspaceNodeModel,
  WorkspaceEngine,
  WorkspaceWidget,
  WorkspaceTabbedModel
} from "@projectstorm/react-workspaces";

import { DefaultWorkspacePanelFactory } from "./DefaultWorkspacePanelFactory";
import { DefaultWorkspacePanelModel } from "./DefaultWorkspacePanelModel";
import { DefaultTrayFactory } from "./DefaultTrayFactory";

export default () => {
  const engine = new WorkspaceEngine();
  engine.registerFactory(new DefaultWorkspacePanelFactory());
  engine.registerFactory(new DefaultTrayFactory());

  const model = new WorkspaceNodeModel();
  model
    //left panel
    .addModel(
      new WorkspaceNodeModel()
        .setExpand(false)
        .setVertical(true)
        .addModel(new DefaultWorkspacePanelModel("Panel 1"))
        .addModel(new DefaultWorkspacePanelModel("Panel 2"))
    )

    //tab panel
    .addModel(
      new WorkspaceTabbedModel()
        .addModel(new DefaultWorkspacePanelModel("Tab 1"))
        .addModel(new DefaultWorkspacePanelModel("Tab 2"))
        .addModel(new DefaultWorkspacePanelModel("Tab 3"))
    )

    //right panel
    .addModel(new DefaultWorkspacePanelModel("Panel 3"))
    .addModel(
      new WorkspaceNodeModel()
        .setExpand(false)
        .setVertical(true)
        .setMode("micro")
        .addModel(new DefaultWorkspacePanelModel("Panel 4"))
        .addModel(new DefaultWorkspacePanelModel("Panel 5"))
        .addModel(new DefaultWorkspacePanelModel("Panel 6"))
    );

  return (
    <div
      style={{
        background: "rgb(70, 70, 70)",
        height: "100%"
      }}
    >
      <WorkspaceWidget engine={engine} model={model} />
    </div>
  );
};
