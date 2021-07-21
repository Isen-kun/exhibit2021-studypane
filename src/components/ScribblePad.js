import { useState } from "react";
import Countable from "countable";

const ScribblePad = () => {
  const [content, setContent] = useState("");
  const [wordCnt, setWordCnt] = useState(0);
  const [charCnt, setCharCnt] = useState(0);

  const counting = () => {
    Countable.count(content, (counter) => {
      setWordCnt(counter.words);
      setCharCnt(counter.all);
    });
  };

  return (
    <div>
      <h4>ScribblePad:</h4>
      <textarea
        className="scribbletext"
        spellCheck="false"
        placeholder="Need to remember something? Note it here!"
        onChange={(e) => {
          setContent(e.target.value);
          counting();
        }}
        style={{
          height: "100%",
          width: "99%",
          minHeight: "40vh",
          resize: "none",
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
        }}
      ></textarea>
      {/* <footer>
        <ul style={{ listStyleType: "none" }}>
          <li>
            <p>{charCnt} :chars</p>
          </li>
          <li>
            <p>{wordCnt} :words</p>
          </li>
        </ul>
      </footer> */}
      {/* <p>{charCnt} :chars</p>
      <p>{wordCnt} :words</p> */}
    </div>
  );
};

export default ScribblePad;
