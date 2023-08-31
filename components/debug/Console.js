export default function Console({ debugStatements }) {
  const printStatement = (statement, index) => {
    return (
      <div key={`message-${index}`}>
        {index.toString().padStart(3, "0")}-{statement.message}
      </div>
    );
  };

  return (
    <div>
      {debugStatements
        .map((statement, index) => printStatement(statement, index))
        .reverse()}
    </div>
  );
}
