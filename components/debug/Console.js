
export default function Console({ debugStatements }) {

  const printStatement = (statement) => {
    return (
      <div key={`${statement.message}-${statement.time}`}>{statement.message}</div>
    )
  }

  return (
    <div>
      {debugStatements.map((statement) => printStatement(statement))}
    </div>
  );
}
