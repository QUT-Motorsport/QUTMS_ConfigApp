import React from "react";
import { Button, Checkbox, Input, Rate, Radio, Switch, Select } from "antd";
import { Link } from "react-router-dom";

import { useTitle } from "./_helpers";

export default function ConfigPage() {
  useTitle("QUTMS Qev3 Config");
  return (
    <div>
      CONFIG <Button type="primary">Test</Button>
      <Checkbox />
      <Input />
      <Rate />
      <Radio />
      <Switch />
      <Select />
      <Link to="www.google.com">Google</Link>
    </div>
  );
}
