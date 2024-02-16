// types.ts 

import { Request } from "express";

//req: Request<{params},{res},{body},{query}>
export type RequestWithBody<T> = Request<{},{},T>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T,B> = Request<T,{},B>
