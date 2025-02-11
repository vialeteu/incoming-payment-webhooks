export type SignRequest = {
  readonly method: string;
  readonly host: string;
  readonly path: string;
  readonly date: string;
  readonly body?: string | undefined;
}
