import { useEffect } from "react";
import { useState } from "react";

export default function App() {
  const [amt, setAmt] = useState("");
  const [curFrom, setCurFrom] = useState(0);
  const [curTo, setCurTo] = useState(0);
  const [err, setErr] = useState("");
  const [convertedAmt, setConvertedAmt] = useState();

  const controller = new AbortController();

  async function getConvertedAmt() {
    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amt}&from=${curFrom}&to=${curTo}`,
      { signal: controller.signal }
    );
    const result = await response.json();
    setConvertedAmt(result.rates[curTo].toFixed(2));
  }

  useEffect(() => {
    setConvertedAmt("");
    if (curFrom !== 0 && curTo !== 0 && curFrom === curTo) {
      setErr("From and to currencies need to be different");
      return;
    }

    if (isNaN(amt)) {
      setErr("Invalid Amount");
      return;
    }

    setErr("");
    if (amt !== "" && curFrom !== 0 && curTo !== 0 && curFrom !== curTo) {
      getConvertedAmt();
    }

    return function () {
      controller.abort();
    };
  }, [amt, curFrom, curTo]);

  return (
    <div className="container">
      <div className="panel">
        <Form
          amt={amt}
          setAmt={setAmt}
          curFrom={curFrom}
          setCurFrom={setCurFrom}
          curTo={curTo}
          setCurTo={setCurTo}
        />
        <Result err={err} convertedAmt={convertedAmt} curTo={curTo} />
      </div>
    </div>
  );
}

function Form({ amt, setAmt, curFrom, setCurFrom, curTo, setCurTo }) {
  return (
    <div className="form">
      <input type="text" value={amt} onChange={(e) => setAmt(e.target.value)} />
      <select value={curFrom} onChange={(e) => setCurFrom(e.target.value)}>
        <option value="0">From</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select value={curTo} onChange={(e) => setCurTo(e.target.value)}>
        <option value="0">To</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
    </div>
  );
}

function Result({ err, convertedAmt, curTo }) {
  return (
    <div className="output">
      <span className="error">{err}</span>
      <h3>
        {convertedAmt} {convertedAmt && curTo}
      </h3>
    </div>
  );
}
