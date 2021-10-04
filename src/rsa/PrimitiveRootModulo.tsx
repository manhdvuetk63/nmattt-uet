import { Button, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
// import * as bigintCryptoUtils from 'bigint-crypto-utils';
import { findPrimitive } from "../utils/rsa";

const PrimitiveRootModulo = () => {
  const [q, setQ] = useState<any>();
  const [result, setResult] = useState<number[]>();

  const reset = () => {
    setQ(null);
    setResult(undefined);
  };
  useEffect(() => {
    if (!q) {
      return q;
    }
    setResult(findPrimitive(q));
  }, [q]);
  return (
    <div>
      <h3 className="mb-4">
        <b>Tìm căn nguyên thủy của số nguyên tố</b>
      </h3>
      <Space>
        {/* <Button onClick={autoFill}>Example (Auto Fill)</Button> */}
        <Button onClick={reset}>Clear All</Button>
      </Space>
      <hr />
      <Space className="w-100" direction="vertical" size="large">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          addonBefore="q"
          placeholder="Nhập số nguyên tố q"
          type="number"
        />
      </Space>
      <hr />
      {result && (
        <Space>
          {result.includes(-1) ? (
            <div>{q} không phải là số nguyên tố</div>
          ) : result.length === 0 ? (
            <div>{q} không có căn nguyên thủy</div>
          ) : (
            <div>
              <b>Các căn nguyên thủy là:</b> {result.join(", ")}.
            </div>
          )}
        </Space>
      )}
    </div>
  );
};

export default PrimitiveRootModulo;
