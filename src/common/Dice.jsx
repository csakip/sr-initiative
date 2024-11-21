export default function Dice({ roll }) {
  if (!roll.rolls) return <></>;
  const sortedRoll = roll.rolls.sort((a, b) => b - a);

  return (
    <>
      <div className='dice'>
        {sortedRoll.map((r, idx) => (
          <span className={`die ${r > 4 ? "hit" : ""}`} key={idx}>
            <div className='face'>{r}</div>
          </span>
        ))}
      </div>
      <div className='result'>
        <strong>{roll.hits}</strong>
      </div>
    </>
  );
}
