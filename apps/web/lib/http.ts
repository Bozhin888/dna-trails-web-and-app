export const json = (data: unknown, status = 200) => Response.json(data, { status });
export const fail = (status: number, error: string) => Response.json({ error }, { status });
export async function body<T = Record<string, unknown>>(req: Request): Promise<T> { try { return (await req.json()) as T; } catch { return {} as T; } }
export const publicUser = (u: import('./types').User) => u;
