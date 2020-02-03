import { DefaultWorkspacePanelFactory } from "./WorkSpace/DefaultWorkspacePanelFactory";
import { DefaultWorkspacePanelModel } from "./WorkSpace/DefaultWorkspacePanelModel";
import { DefaultTrayFactory } from "./WorkSpace/DefaultTrayFactory";
import React from "react";
import {
  WorkspaceNodeModel,
  WorkspaceEngine,
  WorkspaceWidget,
  WorkspaceTabbedModel
} from "@projectstorm/react-workspaces";

import styled from "@emotion/styled";

export interface Demo1State {
  engine: WorkspaceEngine;
  model: WorkspaceNodeModel;
}

namespace S {
  export const Container = styled.div`
    background: rgb(70, 70, 70);
    height: 100%;
  `;
}

export default class extends React.Component<any, Demo1State> {
  constructor(props: any) {
    super(props);
    let engine = new WorkspaceEngine();
    engine.registerFactory(new DefaultWorkspacePanelFactory());
    engine.registerFactory(new DefaultTrayFactory());

    let model = new WorkspaceNodeModel();
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

    this.state = {
      engine: engine,
      model: model
    };
  }

  render() {
    return (
      <S.Container>
        <WorkspaceWidget
          className="demo"
          engine={this.state.engine}
          model={this.state.model}
        />
      </S.Container>
    );
  }
}
