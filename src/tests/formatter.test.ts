import { secondsToStr, strToSeconds } from "../components/small/formatters";

import { describe, it, expect } from "vitest";

describe("Time Formatters", () => {
  it("should format time properly", () => {
    expect(strToSeconds("1")).toEqual(1);
    expect(strToSeconds("10")).toEqual(10);
    expect(strToSeconds("amir")).toBeNull();
    expect(strToSeconds("")).toBeNull();
    expect(strToSeconds(null)).toBeNull();
    expect(strToSeconds("100")).toEqual(60 + 40);
    expect(strToSeconds("1:00")).toEqual(60);
    expect(strToSeconds("01:00")).toEqual(60);
    expect(strToSeconds("600")).toEqual(600);
    expect(strToSeconds("10:00")).toEqual(10 * 60);
    expect(strToSeconds("10:100")).toEqual(10 * 60 + 100);
    expect(strToSeconds("100:10")).toEqual(100 * 60 + 10);
    expect(strToSeconds("1:00:00")).toEqual(1 * 60 * 60);
    expect(strToSeconds("1:0:0")).toEqual(1 * 60 * 60);
    expect(strToSeconds("2:00:00:00")).toEqual(2 * 60 * 60 * 24);
    expect(strToSeconds("2:0:0:0")).toEqual(2 * 60 * 60 * 24);
    expect(strToSeconds("-12")).toEqual(12);
    expect(strToSeconds("a1m2i3r4")).toEqual(1234);
  });

  it("should format seconds to string properly", () => {
    expect(secondsToStr(1)).toEqual("1");
    expect(secondsToStr(10)).toEqual("10");
    expect(secondsToStr(100)).toEqual("1:40");
    expect(secondsToStr(110)).toEqual("1:50");
    expect(secondsToStr(615)).toEqual("10:15");
    expect(secondsToStr(3600)).toEqual("1:00:00");
    expect(secondsToStr(3950)).toEqual("1:05:50");
    expect(secondsToStr(3600 * 24)).toEqual("1:00:00:00");
    expect(secondsToStr(3600 * 24 * 60)).toEqual("60:00:00:00");
    expect(secondsToStr(3600 * 24 * 700 + 5)).toEqual("700:00:00:05");
  });
});
