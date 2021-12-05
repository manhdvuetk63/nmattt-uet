import { Button, Input, Space } from "antd";
import { useState } from "react";

const Substitution = () => {
  const [plaintext, setPlaintext] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [alphabetMix, setAlphabetMix] = useState<string>("");
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const mix = () => {
    setAlphabetMix(
      alphabet
        .split("")
        .sort((a, b) => 0.5 - Math.random())
        .join("")
    );
  };

  const encrypt = () => {
    let result = "";
    let plaintextArr = plaintext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();
      console.log(plaintextArr);
    for (let i = 0; i < plaintextArr.length; i++) {
      let index = alphabet.indexOf(plaintextArr[i]);
      result += alphabetMix[index];
    }
    console.log(result);

    return result;
  };

  const decrypt = () => {
    let result = "";
    let ciphertextArr = ciphertext
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase();
    for (let i = 0; i < ciphertextArr.length; i++) {
      let index = alphabetMix.indexOf(ciphertextArr[i]);
      result += alphabet[index];
    }
    return result;
  };

  return (
    <div>
      <h3 className="mb-4">
        <b>Hệ mật thay thế</b>
      </h3>
      <hr />
      <Space>
        <Button onClick={mix}>Tạo ký tự thay thế</Button>
      </Space>
      <hr />
      <Space className="w-100" direction="vertical" size="large">
        <div className="d-flex w-100">
          {alphabet.split("").map((a, i) => (
            <div
              key={i}
              style={{
                width: "40px",
                border: "1px solid #000000",
              }}
            >
              <div
                key={i}
                style={{
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {a}
              </div>
              {alphabetMix !== "" && (
                <div
                  style={{
                    height: "40px",
                    borderTop: "1px solid #000000",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {alphabetMix[i]}
                </div>
              )}
            </div>
          ))}
        </div>
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
        <hr />
        <h4>Bản rõ thu được: {decrypt()}</h4>
      </Space>
    </div>
  );
};

export default Substitution;
