import { Button, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
// import * as bigintCryptoUtils from 'bigint-crypto-utils';
import { powerModulo } from "../utils/powerModulo";

const DiffieHellman = () => {
  const [q, setQ] = useState<any>();
  const [alpha, setAlpha] = useState<any>();
  const [xA, setXA] = useState<any>();
  const [xB, setXB] = useState<any>();
  const [yA, setYA] = useState<any>();
  const [yB, setYB] = useState<any>();
  const [kA, setKA] = useState<any>();
  const [kB, setKB] = useState<any>();

  const reset = () => {
    setXA(null);
    setXB(null);
    setQ(null);
    setAlpha(null);
    setYA(null);
    setYB(null);
    setKA(null);
    setKB(null);
  };
  useEffect(() => {
    if (!q || !xA || !xB || !alpha) {
      return;
    }
    let kYA = powerModulo(alpha, xA, q);
    let kYB = powerModulo(alpha, xB, q);
    setYA(kYA);
    setYB(kYB);
    setKA(powerModulo(kYB, xA, q));
    setKB(powerModulo(kYA, xB, q));
  }, [alpha, q, xA, xB]);
  return (
    <div>
      <h3 className="mb-4">
        <b>Trao đổi khóa Diffie-Hellman</b>
      </h3>
      <Space>
        {/* <Button onClick={autoFill}>Example (Auto Fill)</Button> */}
        <Button onClick={reset}>Clear All</Button>
      </Space>
      <hr />
      <Space className="w-100" direction="vertical" size="large">
        <h4>Chọn tham số chung</h4>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          addonBefore="q"
          placeholder="Nhập số nguyên tố q"
          type="any"
        />
        <Input
          value={alpha}
          onChange={(e) => setAlpha(e.target.value)}
          addonBefore="α"
          placeholder="Nhập nguyên căn α"
          type="any"
        />
      </Space>
      <hr />
      <Space className="w-100" direction="vertical" size="large">
        <h4>Chọn các khóa riêng</h4>
        <Input
          value={xA}
          onChange={(e) => setXA(e.target.value)}
          addonBefore="xA"
          placeholder="Nhập khóa riêng xA"
          type="any"
        />
        <Input
          value={xB}
          onChange={(e) => setXB(e.target.value)}
          addonBefore="xB"
          placeholder="Nhập khóa riêng xB"
          type="any"
        />
      </Space>
      {!(!q || !xA || !xB || !alpha) && (
        <>
          {" "}
          <hr />
          <Space className="w-100" direction="vertical" size="large">
            <h4>Các khóa công khai</h4>
            <p>
              <b>
                Khóa công khai Ya = α^XA mod q = {alpha}^{xA} mod {q} =
                {yA || "undefined"}
              </b>
            </p>
            <p>
              <b>
                Khóa công khai Yb = α^XB mod q = {alpha}^{xB} mod {q} ={" "}
                {yB || "undefined"}
              </b>
            </p>
          </Space>
          <hr />
          <Space className="w-100" direction="vertical" size="large">
            <h4>Khóa bí mật chung</h4>
            <p>
              <b>
                Khóa bí mật K = YB^XA mod q = {yB}^{xA} mod {q} =
                {kA || "undefined"} (Bên A)
              </b>
            </p>
            <p>
              <b>
                Khóa bí mật K = YA^XB mod q = {yA}^{xB} mod {q} =
                {kB || "undefined"} (Bên B)
              </b>
            </p>
          </Space>
        </>
      )}
    </div>
  );
};

export default DiffieHellman;
