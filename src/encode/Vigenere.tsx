import { Input, Space } from "antd";
import { useState } from "react";

const keyText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Vigenere = () => {
  const [plaintext, setPlaintext] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [keyDecode, setKeyDecode] = useState<string>("");
  const [keyEncode, setKeyEncode] = useState<string>("");

  const isLetter = (str: any) => {
    return str.length === 1 && str.match(/[a-zA-Z]/i);
  };

  const encrypt = () => {
    let result = "";
    let plaintextArr = plaintext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();
    let keyArr = keyEncode
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();

    for (let i = 0, j = 0; i < plaintextArr.length; i++) {
      const c = plaintextArr[i];
      if (isLetter(c)) {
        let index =
          (keyText.indexOf(plaintextArr[i]) + keyText.indexOf(keyArr[j])) % 26;
        result += keyText[Math.abs(index)];
      } else {
        result += c;
      }
      j = ++j % keyArr.length;
    }
    return result;
  };
  const decrypt = () => {
    let result = "";
    let ciphertextArr = ciphertext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();
    let keyArr = keyDecode
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();
    for (let i = 0, j = 0; i < ciphertextArr.length; i++) {
      const c = ciphertextArr[i];
      if (isLetter(c)) {
        let index =
          (keyText.indexOf(ciphertextArr[i]) - keyText.indexOf(keyArr[j])) % 26;
        result += keyText[index < 0 ? index + keyText.length : index];
      } else {
        result += c;
      }
      j = ++j % keyArr.length;
    }
    return result;
  };
  return (
    <div>
      <h3 className="mb-4">
        <b>Hệ mật Vigenere</b>
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
          value={keyEncode}
          onChange={(e) => setKeyEncode(e.target.value)}
          addonBefore="Khóa K"
          placeholder="Nhập khóa K"
          type="any"
        />

        {!!keyEncode && (
          <>
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
          value={keyDecode}
          onChange={(e) => setKeyDecode(e.target.value)}
          addonBefore="Khóa K"
          placeholder="Nhập khóa K"
          type="any"
        />

        <hr />
        {!!keyDecode && (
          <div>
            <hr />
            <h4>Bản rõ thu được: {decrypt()}</h4>
          </div>
        )}
      </Space>
    </div>
  );
};

export default Vigenere;
