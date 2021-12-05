import { Input, Space } from "antd";
import bigInt from "big-integer";
import { useState } from "react";

const keyText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const Affine = () => {
  const [plaintext, setPlaintext] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [keyDecodeA, setKeyDecodeA] = useState<number>();
  const [keyDecodeB, setKeyDecodeB] = useState<number>();
  const [keyEncodeA, setKeyEncodeA] = useState<number>();
  const [keyEncodeB, setKeyEncodeB] = useState<number>();
 
  const encrypt = () => {
    let result = "";
    let plaintextArr = plaintext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();
    for (let i = 0; i < plaintextArr.length; i++) {
      if (plaintextArr[i] !== " ") {
        let index =
          ((keyEncodeA || 0) * keyText.indexOf(plaintextArr[i]) +
            (keyEncodeB || 0)) %
          26;
        result += keyText[Math.abs(index)];
      } else {
        result += plaintextArr[i];
      }
    }
    return result;
  };
  const decrypt = () => {
    let result = "";
    let ciphertextArr = ciphertext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();
    for (let i = 0; i < ciphertextArr.length; i++) {
      if (ciphertextArr[i] !== " ") {
        let index =
          (Number.parseInt(
            bigInt(keyDecodeA || 0)
              .modPow(-1, 26)
              .toString()
          ) *
            (keyText.indexOf(ciphertextArr[i]) - (keyDecodeB || 0))) %
          26;
        result += keyText[index < 0 ? index + 26 : index];
      } else {
        result += ciphertextArr[i];
      }
    }
    return result;
  };
  return (
    <div>
      <h3 className="mb-4">
        <b>Hệ mật Affine</b>
      </h3>
      <Space className="w-100" direction="vertical" size="large">
        <h4>Mã hóa</h4>
        <Input
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          addonBefore="Bản rõ"
          placeholder="Nhập bản rõ"
          type="any"
        />
        <Input
          value={keyEncodeA}
          onChange={(e) => setKeyEncodeA(Number.parseInt(e.target.value) || 0)}
          addonBefore="a"
          placeholder="Nhập a"
          type="any"
        />
        <Input
          value={keyEncodeB}
          onChange={(e) => setKeyEncodeB(Number.parseInt(e.target.value) || 0)}
          addonBefore="b"
          placeholder="Nhập b"
          type="any"
        />
        {!!keyDecodeA && !!keyDecodeB && (
          <>
            <hr />
            <h5>
              K=(a,b)=({keyEncodeA}, {keyEncodeB})
            </h5>
            <h5>
              Ek(x)=({keyEncodeA}x + {keyEncodeB}) mod 26
            </h5>
            <hr />
            <h4>Bản mã thu được: {encrypt()}</h4>
          </>
        )}
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
        <Input
          value={keyDecodeA}
          onChange={(e) => setKeyDecodeA(Number.parseInt(e.target.value) || 0)}
          addonBefore="a"
          placeholder="Nhập a"
          type="number"
        />
        <Input
          value={keyDecodeB}
          onChange={(e) => setKeyDecodeB(Number.parseInt(e.target.value) || 0)}
          addonBefore="b"
          placeholder="Nhập b"
          type="number"
        />
        <hr />
        {!!keyDecodeA && !!keyDecodeB && (
          <div>
            <h5>
              K= (a, b) = ({keyDecodeA}, {keyDecodeB})
            </h5>
            <h5>
              Ek(x) = ({keyDecodeA}x + {keyDecodeB}) mod 26
            </h5>
            <h5>
              Dk(y) =
              {bigInt(keyDecodeA || 0)
                .modPow(-1, 26)
                .toString()}
              (y-{keyDecodeB}) mod 26
            </h5>
            <hr />
            <h4>Bản rõ thu được: {decrypt()}</h4>
          </div>
        )}
      </Space>
    </div>
  );
};

export default Affine;
