import { validateAuth, validateEmail, validatePassword } from "./helper";

test("should return true if email is a valid email", () => {
  let email = "mike@microsoft.com";
  let expected = true;
  expect(validateEmail(email)).toBe(expected);

  email = "some-email@email.com";
  expect(validateEmail(email)).toBe(expected);

  email = "@fake.com";
  expected = false;

  expect(validateEmail(email)).toBe(expected);

  email = "fake.com";

  expect(validateEmail(email)).toBe(expected);

  email = "12@fake.com";

  expect(validateEmail(email)).toBe(expected);
});

test("should return true if password passes certain criterias", () => {
  let password = "jNS7_zx-3~FppJ}5";
  let expected = true;

  expect(validatePassword(password)).toBe(expected);

  password = 'y{"HC\\$Zb+12';
  expect(validatePassword(password)).toBe(expected);

  password = "DtUux5R7";
  expected = false;
  expect(validatePassword(password)).toBe(expected);

  password = "k;$a1ru;2r{h";
  expect(validatePassword(password)).toBe(expected);

  password = "?!4;9^[+)5`&";
  expect(validatePassword(password)).toBe(expected);

  password = "some";
  expect(validatePassword(password)).toBe(expected);

  password = "";
  expect(validatePassword(password)).toBe(expected);
});

test("should return true on valid login credentials", () => {
  let data = {
    email: "mike.warren@microsoft.com",
    password: ">wJ;As5J4TtU",
  };

  let expected = true;
  expect(validateAuth(data)).toBe(expected);

  data = {
    email: "mike.warren@microsoft.com",
    password: "Sr4vT3oE",
  };
  expected = false;

  expect(validateAuth(data)).toBe(expected);

  data = {
    email: "mike.warren@microsoft",
    password: ">wJ;As5J4TtU",
  };

  expect(validateAuth(data)).toBe(expected);

  data = {
    email: "",
    password: "",
  };

  expect(validateAuth(data)).toBe(expected);
});
