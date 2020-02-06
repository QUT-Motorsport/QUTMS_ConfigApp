import Head from "next/head";
import {
  Button,
  Checkbox,
  Input,
  Rate,
  Radio,
  Switch,
  Select,
  Slider
} from "antd";
import Link from "next/link";

export default () => (
  <>
    <Head>
      <title>QUT Config App - Config</title>
    </Head>
    <div>
      CONFIG <Button type="primary">Test</Button>
      <Checkbox />
      <Input />
      <Rate />
      <Radio />
      <Switch />
      <Select />
      <Link href="www.google.com">Google</Link>
    </div>
  </>
);
