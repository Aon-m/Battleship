import toNumber from "../toNumber";

describe("toNumber", () => {
  test("converts integer string", () => {
    expect(toNumber("42")).toBe(42);
  });

  test("converts decimal string", () => {
    expect(toNumber("3.14")).toBe(3.14);
  });

  test("converts negative number string", () => {
    expect(toNumber("-7")).toBe(-7);
  });

  test("returns non-number string unchanged", () => {
    expect(toNumber("hello")).toBe("hello");
  });

  test("returns empty string unchanged", () => {
    expect(toNumber("")).toBe("");
  });

  test("returns whitespace string unchanged", () => {
    expect(toNumber("   ")).toBe("   ");
  });

  test("keeps numbers unchanged", () => {
    expect(toNumber(42)).toBe(42);
  });
});
