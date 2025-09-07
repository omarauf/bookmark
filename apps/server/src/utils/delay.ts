export async function delay(ms = 500) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function randomDelay(min: number, max: number) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return await new Promise((resolve) => setTimeout(resolve, delay));
}
