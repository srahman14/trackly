import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./errors";

// API succcess -> 200 status code
export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json({ data }, { status });
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { message: error.message, code: error.code } },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          issues: error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
      },
      { status: 400 },
    );
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { error: { message: "Internal server error" } },
    { status: 500 },
  );
}
