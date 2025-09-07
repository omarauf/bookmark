type Success<T> = [T, undefined];

type Failure<E> = [undefined, E];

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return [undefined, error as E];
  }
}
