/**
 * Get cookie value or null if not found
 * @param {string} name Name of the cookie
 * @returns {string | null} Value of the cookie
 */
export const getCookie = (name: string): string | null | undefined => {
  const regex = new RegExp("^(?:.*;)?\\s*" + name + "\\s*=\\s*([^;]+)(?:.*)?$")
  return (document.cookie.match(regex) || ['', null])[1];
};

/**
 * Validate email address format
 * @param {string} email Email to be validated
 * @returns {bool}
 */
 export const validateEmail = (email: string): boolean => {
  return Boolean(email.match(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  ));
};

/**
 * A custom error class that is thrown when a validation fails.           
 * @param {string} message - the error message.           
 * @param {string} field - the field that the error is thrown for.           
 */
export class ValidationError extends Error {
  field: string;

  constructor(message: string, field: string) {
    super(message);
    this.field = field;
  }
}

/**
 * Pad the end of an array with empty objects
 * @param {Array} array Array to be padded
 * @param {number} minLength Intended minimum length of the array
 * @param {object} fillValue Value to be used to fill the array
 * @returns {Array} Padded array
 */
 export function padEnd<T = any>(array: T[], minLength: number, fillValue: string | null = null): T[] {
  return Object.assign(new Array(minLength).fill(fillValue), array);
}

/**
 * Converts a number of seconds into a string of hours and minutes.           
 * @param {number} n - the number of seconds to convert           
 * @returns {string} - the number of hours and minutes in the format "hh:mm"           
 */
export function timeConvert(n: number) {
  var num = n;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return `${rhours}h ${rminutes}m`;
}

/**
 * Takes in an array and splits it into chunks of the given size.           
 * @param {T[]} arr - the array to split           
 * @param {number} chunkSize - the size of each chunk           
 * @returns {T[][]} - the array of chunks           
 */
export function sliceIntoChunks<T>(arr: T[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
  }
  return res;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).       
 * @param {number} min - the minimum integer to return.       
 * @param {number} max - the maximum integer to return.       
 * @returns {number} - a random integer between min and max.       
 */
export function getRandomInt(min: number, max: number): number {       
  // Create byte array and fill with 1 random number
  const byteArray = new Uint8Array(1);
  window.crypto.getRandomValues(byteArray);

  const range = max - min + 1;
  const max_range = 256;
  if (byteArray[0] >= Math.floor(max_range / range) * range)
      return getRandomInt(min, max);
  return min + (byteArray[0] % range);
}