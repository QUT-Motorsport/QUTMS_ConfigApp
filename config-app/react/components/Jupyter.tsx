import { Kernel } from "@jupyterlab/services";
import { MutableRefObject, useRef, useEffect, useState } from "react";
import { shims, DOMWidgetView, DOMWidgetModel } from "@jupyter-widgets/base";
import * as pWidget from "@lumino/widgets";
import { HTMLManager } from "@jupyter-widgets/html-manager";
import {
  KernelManager,
  ServerConnection,
  KernelMessage
} from "@jupyterlab/services";

export class WidgetManager extends HTMLManager {
  constructor(kernel: Kernel.IKernelConnection, el: HTMLElement) {
    super();
    this.kernel = kernel;
    this.el = el;

    kernel.registerCommTarget(this.comm_target_name, async (comm, msg) => {
      const oldComm = new shims.services.Comm(comm);
      await this.handle_comm_open(oldComm, msg);
    });
  }

  display_view(
    msg: any,
    view: DOMWidgetView,
    options: any
  ): Promise<HTMLElement> {
    return Promise.resolve(view).then(view => {
      pWidget.Widget.attach(view.pWidget as any, this.el);

      // TODO: figure out what the heck is wrong here
      view.on("remove", function() {
        console.log("view removed", view);
      });
      // We will resolve this lie in another PR.
      return view as any;
    });
  }

  /**
   * Create a comm.
   */
  async _create_comm(
    target_name: string,
    model_id: string,
    data?: any,
    metadata?: any
  ): Promise<shims.services.Comm> {
    const comm = this.kernel.connectToComm(target_name, model_id);
    if (data || metadata) {
      comm.open(data, metadata);
    }
    return Promise.resolve(new shims.services.Comm(comm));
  }

  /**
   * Get the currently-registered comms.
   */
  _get_comm_info(): Promise<any> {
    return this.kernel
      .requestCommInfo({ target_name: this.comm_target_name })
      .then(reply => (reply.content as any).comms);
  }

  kernel: Kernel.IKernelConnection;
  el: HTMLElement;
}

const useJupyter = () => {
  const BASE_URL = `http://localhost:${process.env.JUPYTER_PORT}`;

  const [code, setCode] = useState("");

  // Connect to the notebook webserver.
  const kernelManager = new KernelManager({
    serverSettings: ServerConnection.makeSettings({
      baseUrl: BASE_URL,
      wsUrl:
        "ws:" +
        BASE_URL.split(":")
          .slice(1)
          .join(":")
    })
  });
  const ref: MutableRefObject<null | HTMLDivElement> = useRef(null);

  useEffect(() => {
    kernelManager.startNew().then(kernel => {
      const manager = new WidgetManager(kernel, ref.current!);

      // Run backend code to create the widgets.  You could also create the
      // widgets in the frontend, like the other widget examples demonstrate.
      kernel.requestExecute({ code }).onIOPub = (msg: any): void => {
        // If we have a display message, display the widget.
        if (KernelMessage.isDisplayDataMsg(msg)) {
          const widgetData: any =
            msg.content.data["application/vnd.jupyter.widget-view+json"];
          if (widgetData !== undefined && widgetData.version_major === 2) {
            const model = manager.get_model(widgetData.model_id);
            if (model !== undefined) {
              model.then((model: DOMWidgetModel) => {
                manager.display_model(msg, model);
              });
            }
          }
        }
      };
    });
  }, []);

  return { ref, code, setCode };
};

export default ({ _jupyter: { ref, code } = useJupyter() }) => (
  <>
    <code>{code}</code>
    <div ref={ref}></div>
  </>
);
