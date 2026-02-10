"use client";

import { useEffect, useState } from "react";

export function DigitalClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="flex flex-col items-center">
        <div className="h-20 animate-pulse rounded bg-muted md:h-24" />
      </div>
    );
  }

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = time.toLocaleDateString("id-ID", dateOptions);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-6xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
          {hours}
        </span>
        <span className="text-5xl font-bold text-muted-foreground md:text-6xl lg:text-7xl animate-pulse">
          :
        </span>
        <span className="text-6xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
          {minutes}
        </span>
        <span className="text-5xl font-bold text-muted-foreground md:text-6xl lg:text-7xl animate-pulse">
          :
        </span>
        <span className="text-4xl font-medium tracking-tight text-success md:text-5xl lg:text-6xl">
          {seconds}
        </span>
      </div>
      <p className="text-base text-muted-foreground md:text-lg">{formattedDate}</p>
    </div>
  );
}
