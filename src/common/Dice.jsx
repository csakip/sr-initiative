export default function Dice({ roll }) {
  if (!roll.rolls) return <></>;

  return (
    <>
      <div className='dice'>
        {roll.rolls.map((r, idx) => (
          <span className='die' key={idx}>
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
