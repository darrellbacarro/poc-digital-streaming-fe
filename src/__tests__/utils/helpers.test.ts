import {
  getCookie,
  getRandomInt,
  padEnd,
  parseSignUpFieldLabels,
  sleep,
  sliceIntoChunks,
  timeConvert,
  validateEmail,
  ValidationError
} from "../../utils/helpers";

describe("ValidationError", () => {
  let instance: any;

  beforeEach(() => {
    instance = new ValidationError("message", "field");
  });

  it("instance should be an instanceof ValidationError", () => {
    expect(instance instanceof ValidationError).toBeTruthy();
  });
});

describe("getCookie", () => {
  it("should expose a function", () => {
    expect(getCookie).toBeDefined();
  });

  it("getCookie should return expected output", () => {
    const retValue = getCookie('cookie');
    expect(retValue).toBeFalsy();
  });
});
describe("validateEmail", () => {
  it("should expose a function", () => {
    expect(validateEmail).toBeDefined();
  });

  it("validateEmail should return expected output", () => {
    expect(validateEmail('test')).toBeFalsy();
    expect(validateEmail('test@email.com')).toBeTruthy();
  });
});
describe("padEnd", () => {
  it("should expose a function", () => {
    expect(padEnd).toBeDefined();
  });

  it("padEnd should return expected output", () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const retValue = padEnd(arr, 10, '0');
    expect(retValue.length).toBe(10);
  });
});
describe("timeConvert", () => {
  it("should expose a function", () => {
    expect(timeConvert).toBeDefined();
  });

  it("timeConvert should return expected output", () => {
    expect(timeConvert(0)).toBe('0h 0m');
    expect(timeConvert(60)).toBe('1h 0m');
    expect(timeConvert(90)).toBe('1h 30m');
  });
});
describe("sliceIntoChunks", () => {
  it("should expose a function", () => {
    expect(sliceIntoChunks).toBeDefined();
  });

  it("sliceIntoChunks should return expected output", () => {
    const arr = [1, 2, 3, 4, 5, 6];

    const retValue = sliceIntoChunks(arr, 2);
    expect(retValue).toStrictEqual([[1, 2], [3, 4], [5, 6]]);
  });
});
describe("getRandomInt", () => {
  it("should expose a function", () => {
    expect(getRandomInt).toBeDefined();
  });

  it("getRandomInt should return expected output", () => {
    const min = 0, max = 10;
    const retValue = getRandomInt(min,max);
    expect(retValue >= min && retValue <= max).toBeTruthy();
  });
});
describe("sleep", () => {
  it("should expose a function", () => {
    expect(sleep).toBeDefined();
  });

  it("sleep should return expected output", () => {
    const retValue = sleep(0);
    expect(retValue instanceof Promise).toBeTruthy();
  });
});
describe("parseSignUpFieldLabels", () => {
  it("should expose a function", () => {
    expect(parseSignUpFieldLabels).toBeDefined();
  });

  it("parseSignUpFieldLabels should return expected output", () => {
    const retValue = parseSignUpFieldLabels('email');
    expect(retValue).toBe('Email Address');
  });
});
