// this component module has to be dynamically loaded because their modules contain DOM api's at the top level
import dynamic from "next/dynamic";
const JupyterWidget = dynamic(() => import("../components/Jupyter"), {
  ssr: false
});

export default () => <JupyterWidget />;
