/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Input, Row, Select, Space } from "antd";
import { useState } from "react";
// import * as bigintCryptoUtils from 'bigint-crypto-utils';
import {
  getColumnVectors,
  getDigrams,
  getPremodMatrix,
  getTrigraph,
  reverseSearch,
} from "./Util";

const { Option } = Select;
const Hill = () => {
  const [plaintext, setPlaintext] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [typeMatrix, setTypeMatrix] = useState<number>(0);
  const [keyM21, setKeyM21] = useState<number>();
  const [keyM22, setKeyM22] = useState<number>();
  const [keyM23, setKeyM23] = useState<number>();
  const [keyM24, setKeyM24] = useState<number>();

  const [keyM31, setKeyM31] = useState<number>();
  const [keyM32, setKeyM32] = useState<number>();
  const [keyM33, setKeyM33] = useState<number>();
  const [keyM34, setKeyM34] = useState<number>();
  const [keyM35, setKeyM35] = useState<number>();
  const [keyM36, setKeyM36] = useState<number>();
  const [keyM37, setKeyM37] = useState<number>();
  const [keyM38, setKeyM38] = useState<number>();
  const [keyM39, setKeyM39] = useState<number>();
  const [matrix22, setMatrix22] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  const [matrix33, setMatrix33] = useState<number[][]>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const encrypt = () => {
    let plainT = plaintext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();

    let dimension = typeMatrix === 0 ? 2 : 3;
    let encryptedArray = [];
    let columnVectors;
    let topElement;
    let bottomElement;
    let premodMatrix;

    if (plainT === "") {
      return "";
    } else {
      if (dimension === 2) {
        var digrams = getDigrams(plainT);
        columnVectors = getColumnVectors(digrams, 2);
        premodMatrix = getPremodMatrix(columnVectors, 2);

        for (var i in premodMatrix) {
          topElement = premodMatrix[i][0];
          bottomElement = premodMatrix[i][1];
          encryptedArray.push([topElement % 26, bottomElement % 26]);
        }
      } else {
        var trigraph = getTrigraph(plainT);
        columnVectors = getColumnVectors(trigraph, 3);
        premodMatrix = getPremodMatrix(columnVectors, 3);
        var middleElement;

        for (let i in premodMatrix) {
          topElement = premodMatrix[i][0];
          middleElement = premodMatrix[i][1];
          bottomElement = premodMatrix[i][2];
          encryptedArray.push([
            topElement % 26,
            middleElement % 26,
            bottomElement % 26,
          ]);
        }
      }

      console.log(
        reverseSearch(encryptedArray, dimension).toString().replace(/,/gi, " ")
      );
      return reverseSearch(encryptedArray, dimension)
        .toString()
        .replace(/,/gi, " ");
    }
  };

  return (
    <div>
      <h3 className="mb-4">
        <b>Hệ mật mã Hill</b>
      </h3>
      <Space className="w-100" direction="vertical" size="large">
        <Select
          defaultValue={0}
          style={{ width: 120 }}
          onChange={(value) => setTypeMatrix(value)}
        >
          <Option value={0}>Ma trận 2x2</Option>
          <Option value={1}>Ma trận 3x3</Option>
        </Select>
        <h4>Tạo khóa</h4>
        <Row>
          <Col md={8}>
            <div>
              <div className="d-flex">
                <Input
                  value={keyM21}
                  onChange={(e) => setKeyM21(Number.parseInt(e.target.value))}
                  addonBefore="K11"
                  type="number"
                />
                <Input
                  value={keyM22}
                  onChange={(e) => setKeyM22(Number.parseInt(e.target.value))}
                  addonBefore="K12"
                  type="number"
                />
              </div>
              <div className="d-flex">
                <Input
                  value={keyM23}
                  onChange={(e) => setKeyM23(Number.parseInt(e.target.value))}
                  addonBefore="K21"
                  type="number"
                />
                <Input
                  value={keyM24}
                  onChange={(e) => setKeyM24(Number.parseInt(e.target.value))}
                  addonBefore="K22"
                  type="number"
                />
              </div>
            </div>
          </Col>
          <Col>
            <Row className="m-auto">
              <div
                style={{
                  width: "68px",
                  margin: "auto",
                  fontSize: "30px",
                  fontWeight: 600,
                }}
              >
                K ={" "}
              </div>
              <div>
                <table className="matrix">
                  <tr>
                    <td>{keyM21}</td>
                    <td>{keyM22}</td>
                  </tr>
                  <tr>
                    <td>{keyM23}</td>
                    <td>{keyM24}</td>
                  </tr>
                </table>
              </div>
            </Row>
          </Col>
        </Row>
      </Space>
      <Space className="w-100" direction="vertical" size="large">
        <h4>Mã hóa</h4>
        <Input
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          addonBefore="Bản rõ"
          placeholder="Nhập bản rõ"
          type="any"
        />
        <hr />
        <h4>Bản mã thu được: {encrypt()}</h4>
      </Space>
      <hr />
    </div>
  );
};

export default Hill;
