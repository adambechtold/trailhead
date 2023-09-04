describe("jest", () => {
  test("we can run tests", () => {
    expect(true).toBeTruthy();
  });

  test("we can assign variables", () => {
    const a: number = 1;
    expect(a).toEqual(1);
  });
});
