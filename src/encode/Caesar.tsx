import { Input, Space } from "antd";
import { useState } from "react";
const keyText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const Caesar = () => {
  const [plaintext, setPlaintext] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [keyDecode, setKeyDecode] = useState<number>();
  const [keyEncode, setKeyEncode] = useState<number>();

  const encrypt = () => {
    let result = "";
    let plaintextArr = plaintext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();

    for (let i = 0; i < plaintextArr.length; i++) {
      try {
        let index =
          (keyText.indexOf(plaintextArr[i]) + (keyEncode || 0)) %
          keyText.length;
        result += keyText[Math.abs(index)];
      } catch {
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
      try {
        let index =
          (keyText.indexOf(ciphertextArr[i]) - (keyDecode || 0)) %
          keyText.length;
        result += keyText[index < 0 ? index + keyText.length : index];
      } catch {
        result += ciphertextArr[i];
      }
    }
    return result;
  };

  return (
    <div>
      <h3 className="mb-4">
        <b>Hệ mã dịch chuyển - Mã hóa Caesar</b>
      </h3>
      <hr />
      <Space className="w-100" direction="vertical" size="large">
        <h4>Ký tự: {keyText}</h4>
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
        <Input
          value={keyEncode}
          onChange={(e) => setKeyEncode(Number.parseInt(e.target.value) || 0)}
          addonBefore="Khóa K"
          placeholder="Nhập khóa K"
          type="any"
        />
        <hr />
        <h4>Bản mã thu được: {encrypt()}</h4>
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
          value={keyDecode}
          onChange={(e) => setKeyDecode(Number.parseInt(e.target.value) || 0)}
          addonBefore="Khóa K"
          placeholder="Nhập khóa K"
          type="number"
        />
        <hr />
        <h4>Bản mã thu được: {decrypt()}</h4>
      </Space>
    </div>
  );
};

export default Caesar;
