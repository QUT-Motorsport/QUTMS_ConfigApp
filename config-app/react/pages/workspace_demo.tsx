import dynamic from "next/dynamic";
const WorkSpace = dynamic(() => import("../components/WorkSpace"), {
  ssr: false
});

export default () => <WorkSpace />;
