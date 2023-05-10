
export default function Console({ debugStatements }) {

  const printStatement = (statement, index) => {
    return (
      <div key={`message-${index}`}>{statement.message}</div>
    )
  }

  return (
    <div>
      {debugStatements.map((statement, index) => printStatement(statement, index))}
    </div>
  );
}
