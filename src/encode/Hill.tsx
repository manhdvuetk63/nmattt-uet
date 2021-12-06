/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Input, Row, Select, Space } from "antd";
import { useEffect, useState } from "react";
// import * as bigintCryptoUtils from 'bigint-crypto-utils';
import {
  getColumnVectors,
  getDigrams,
  getPremodMatrix,
  getTrigraph,
  reverseSearch,
} from "./Util";

const keyText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const { Option } = Select;
const Hill = () => {
  const [plaintext, setPlaintext] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [typeMatrix, setTypeMatrix] = useState<number>(0);
  const [keyEncode, setKeyEncode] = useState<string>("");
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

  useEffect(() => {
    setMatrix22([
      [keyM21 || 0, keyM22 || 0],
      [keyM23 || 0, keyM24 || 0],
    ]);
  }, [keyM21, keyM22, keyM23, keyM24]);

  useEffect(() => {
    setMatrix33([
      [keyM31 || 0, keyM32 || 0, keyM33 || 0],
      [keyM34 || 0, keyM35 || 0, keyM36 || 0],
      [keyM37 || 0, keyM38 || 0, keyM39 || 0],
    ]);
  }, [keyM31, keyM32, keyM33, keyM34, keyM35, keyM36, keyM37, keyM38, keyM39]);

  const getKeyMatrix = (key: any, keyMatrix: any) => {
    let plainT = key
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    let k = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        try {
          keyMatrix[i][j] = plainT[k].charCodeAt(0) % 65;
        } catch {
          keyMatrix[i][j] = 0;
        }
        k++;
      }
    }
    setMatrix33([...keyMatrix]);
    setMatrix22([
      [keyMatrix[0][0], keyMatrix[0][1]],
      [keyMatrix[0][2], keyMatrix[1][0]],
    ]);
  };
  useEffect(() => {
    if (keyEncode.length <= 0) {
      return;
    }
    getKeyMatrix(keyEncode, matrix33);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyEncode]);

  const encrypt = () => {
    let sizeMatrix = typeMatrix === 0 ? 2 : 3;
    let matrix = typeMatrix === 0 ? matrix22 : matrix33;
    let plainT = plaintext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    let temp = (sizeMatrix - (plainT.length % sizeMatrix)) % sizeMatrix;

    for (let i = 0; i < temp; i++) {
      plainT += "X";
    }

    let k = 0;
    let result = "";
    while (k < plainT.length) {
      for (let i = 0; i < sizeMatrix; i++) {
        let sum = 0;
        let temp = k;
        for (let j = 0; j < sizeMatrix; j++) {
          sum +=
            (((matrix[i][j] % 26) * keyText.indexOf(plainT[temp++])) % 26) % 26;
          sum = sum % 26;
        }
        result += keyText[sum];
      }
      k += sizeMatrix;
    }
    return result;
  };

  const modInverse = (a: number, m: number) => {
    a = a % m;
    for (let x = -m; x < m; x++) if ((a * x) % m === 1) return x;
  };

  const getCofactor = (
    a: number[][],
    temp: number[][],
    p: number,
    q: number,
    n: number
  ) => {
    let i = 0,
      j = 0;
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (row !== p && col !== q) {
          temp[i][j++] = a[row][col];
          if (j === n - 1) {
            j = 0;
            i++;
          }
        }
      }
    }
  };

  const determinant = (a: number[][], n: number, N: number) => {
    let D = 0;
    if (n === 1) return a[0][0];
    let temp = new Array(N).fill(0).map(() => new Array(N).fill(0));
    let sign = 1;
    for (let f = 0; f < n; f++) {
      getCofactor(a, temp, 0, f, n);
      D += sign * a[0][f] * determinant(temp, n - 1, N);
      sign = -sign;
    }
    return D;
  };

  const adjoint = (a: number[][], adj: number[][], N: number) => {
    if (N === 1) {
      adj[0][0] = 1;
      return;
    }
    let sign = 1;
    let temp = new Array(N).fill(0).map(() => new Array(N).fill(0));
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        getCofactor(a, temp, i, j, N);
        sign = (i + j) % 2 === 0 ? 1 : -1;
        adj[j][i] = sign * determinant(temp, N - 1, N);
      }
    }
  };
  const inverse = (a: number[][], inv: number[][], N: number) => {
    let det = determinant(a, N, N);
    if (det === 0) {
      return false;
    }
    let invDet = modInverse(det, 26) || 0;

    let adj = new Array(N).fill(0).map(() => new Array(N).fill(0));
    adjoint(a, adj, N);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) inv[i][j] = (adj[i][j] * invDet) % 26;
    return true;
  };
  const decrypt = () => {
    let sizeMatrix = typeMatrix === 0 ? 2 : 3;
    let cipherT = ciphertext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    let a = typeMatrix === 0 ? matrix22 : matrix33;
    let adj = new Array(sizeMatrix)
      .fill(0)
      .map(() => new Array(sizeMatrix).fill(0));
    let inv = new Array(sizeMatrix)
      .fill(0)
      .map(() => new Array(sizeMatrix).fill(0));
    if (inverse(a, inv, sizeMatrix)) {
      console.log("Inverse exist");
    }
    let k = 0;
    let result = "";
    while (k < cipherT.length) {
      for (let i = 0; i < sizeMatrix; i++) {
        let sum = 0;
        let temp = k;
        for (let j = 0; j < sizeMatrix; j++) {
          let x = (inv[i][j] + 26) % 26;
          let y = keyText.indexOf(cipherT[temp++]);
          sum += (x * y) % 26;
          sum = sum % 26;
        }

        result += keyText[(sum + 26) % 26];
      }
      k += sizeMatrix;
    }
    let f = result.length - 1;
    while (result[f] === "X") {
      result = result.slice(0, -1);
    }
    return result;
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
        <Input
          value={keyEncode}
          onChange={(e) => setKeyEncode(e.target.value)}
          addonBefore="Key text"
          type="any"
        />
        {typeMatrix === 0 ? (
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
                    {matrix22.map((m, i) => (
                      <tr key={i}>
                        {m.map((n, j) => (
                          <td key={j}>{n}</td>
                        ))}
                      </tr>
                    ))}
                  </table>
                </div>
              </Row>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={12}>
              <div>
                <div className="d-flex">
                  <Input
                    value={keyM31}
                    onChange={(e) => setKeyM31(Number.parseInt(e.target.value))}
                    addonBefore="K11"
                    type="number"
                  />
                  <Input
                    value={keyM32}
                    onChange={(e) => setKeyM32(Number.parseInt(e.target.value))}
                    addonBefore="K12"
                    type="number"
                  />
                  <Input
                    value={keyM33}
                    onChange={(e) => setKeyM33(Number.parseInt(e.target.value))}
                    addonBefore="K13"
                    type="number"
                  />
                </div>
                <div className="d-flex">
                  <Input
                    value={keyM34}
                    onChange={(e) => setKeyM34(Number.parseInt(e.target.value))}
                    addonBefore="K21"
                    type="number"
                  />
                  <Input
                    value={keyM35}
                    onChange={(e) => setKeyM35(Number.parseInt(e.target.value))}
                    addonBefore="K22"
                    type="number"
                  />
                  <Input
                    value={keyM36}
                    onChange={(e) => setKeyM36(Number.parseInt(e.target.value))}
                    addonBefore="K23"
                    type="number"
                  />
                </div>
                <div className="d-flex">
                  <Input
                    value={keyM37}
                    onChange={(e) => setKeyM37(Number.parseInt(e.target.value))}
                    addonBefore="K31"
                    type="number"
                  />
                  <Input
                    value={keyM38}
                    onChange={(e) => setKeyM38(Number.parseInt(e.target.value))}
                    addonBefore="K32"
                    type="number"
                  />
                  <Input
                    value={keyM39}
                    onChange={(e) => setKeyM39(Number.parseInt(e.target.value))}
                    addonBefore="K33"
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
                    {matrix33.map((m, i) => (
                      <tr key={i}>
                        {m.map((n, j) => (
                          <td key={j}>{n}</td>
                        ))}
                      </tr>
                    ))}
                  </table>
                </div>
              </Row>
            </Col>
          </Row>
        )}
      </Space>
      <hr />
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
        {plaintext.length > 0 && <h4>Bản mã thu được: {encrypt()}</h4>}
      </Space>
      <hr />
      <Space className="w-100" direction="vertical" size="large">
        <h4>Giải mã</h4>
        <Input
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          addonBefore="Bản mã"
          placeholder="Nhập bản mã"
          type="any"
        />
        <hr />
        {plaintext.length > 0 && <h4>Bản mã thu được: {decrypt()}</h4>}
      </Space>
      <hr />
    </div>
  );
};

export default Hill;
