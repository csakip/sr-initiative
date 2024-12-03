export default function HealthBarEditor({ injury = 0, setInjury = 0, max = 20 }) {
  const boxes = new Array(18).fill(0);
  function setChecks(value) {
    if (18 - value === injury && injury === 18 - value) {
      setInjury(0);
    } else {
      setInjury(18 - value);
    }
  }
  // The boxes are reversed because of the hover effect
  return (
    <div className='d-flex flex-row-reverse justify-content-end'>
      {boxes.map((_, idx) => (
        <div
          key={idx}
          className={`health-bar-box ${17 - idx < max ? "" : "disabled"} ${
            18 - idx - injury < 1 ? "checked" : ""
          }`}
          onClick={() => setChecks(idx)}>
          {18 - idx - injury < 1 ? <i className='bi bi-x-lg'></i> : 18 - idx - injury}
        </div>
      ))}
      <div style={{ width: "2em" }}>{!!injury && <>-{Math.ceil(injury / 3)}</>}</div>
    </div>
  );
}
