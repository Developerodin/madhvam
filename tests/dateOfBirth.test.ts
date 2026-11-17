import { describe, expect, it } from "vitest";
import {
  dateOfBirthError,
  formatDateOfBirth,
  latestAdultDob,
} from "@/lib/dateOfBirth";

describe("date of birth", () => {
  const today = "2026-11-17";

  it("allows an empty value", () => {
    expect(dateOfBirthError("", today)).toBe("");
    expect(dateOfBirthError("   ", today)).toBe("");
  });

  it("accepts a date that is already 18", () => {
    expect(latestAdultDob(today)).toBe("2008-11-17");
    expect(dateOfBirthError("2008-11-17", today)).toBe("");
    expect(dateOfBirthError("1990-01-01", today)).toBe("");
  });

  it("rejects anyone younger than 18", () => {
    expect(dateOfBirthError("2008-11-18", today)).toBe("You must be 18 or older.");
    expect(dateOfBirthError("2026-01-01", today)).toBe("You must be 18 or older.");
  });

  it("rejects dates that are not real", () => {
    expect(dateOfBirthError("2008-02-31", today)).toBe("Enter a valid date of birth.");
    expect(dateOfBirthError("17/11/1990", today)).toBe("Enter a valid date of birth.");
    expect(dateOfBirthError("1899-12-31", today)).toBe("Enter a valid date of birth.");
  });

  it("uses 28 February when the 18th birthday would fall on a missing leap day", () => {
    expect(latestAdultDob("2024-02-29")).toBe("2006-02-28");
    expect(dateOfBirthError("2006-02-28", "2024-02-29")).toBe("");
    expect(dateOfBirthError("2006-03-01", "2024-02-29")).toBe(
      "You must be 18 or older.",
    );
  });

  it("formats stored dates as day/month/year", () => {
    expect(formatDateOfBirth("1990-03-04")).toBe("04/03/1990");
  });
});
