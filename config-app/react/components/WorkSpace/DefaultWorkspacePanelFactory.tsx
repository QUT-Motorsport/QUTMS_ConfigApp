import {
  GenerateMicroButtonEvent,
  GeneratePanelTabEvent,
  WorkspacePanelFactory,
  GenerateEvent
} from "@projectstorm/react-workspaces";

import { DefaultWorkspacePanelModel } from "./DefaultWorkspacePanelModel";
import DefaultPanelTitleWidget from "./widgets/DefaultPanelTitleWidget";
import DefaultPanelContentWidget from "./widgets/DefaultPanelContentWidget";
import DefaultPanelMicroButtonWidget from "./widgets/DefaultPanelMicroButtonWidget";
import DefaultPanelTabWidget from "./widgets/DefaultPanelTabWidget";

export class DefaultWorkspacePanelFactory extends WorkspacePanelFactory<
  DefaultWorkspacePanelModel
> {
  constructor() {
    super("default");
  }

  generatePanelTitle = (event: any) => (
    <DefaultPanelTitleWidget title={event.model.displayName} />
  );

  generatePanelContent = (event: GenerateEvent<DefaultWorkspacePanelModel>) => (
    <DefaultPanelContentWidget>
      Hello World: {event.model.displayName}
    </DefaultPanelContentWidget>
  );

  generatePanelTab = (
    event: GeneratePanelTabEvent<DefaultWorkspacePanelModel>
  ) => (
    <DefaultPanelTabWidget
      name={event.model.displayName}
      selected={event.selected}
    />
  );

  generateMicroButton = (
    event: GenerateMicroButtonEvent<DefaultWorkspacePanelModel>
  ) => (
    <DefaultPanelMicroButtonWidget
      selected={event.selected}
      icon={event.model.icon}
    />
  );

  generateModel = () => new DefaultWorkspacePanelModel("Test");
}
