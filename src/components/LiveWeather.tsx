import { useState, useEffect } from "react";
import { CloudSun, Wind, Droplets, Thermometer, Sun, CloudRain, CloudSnow, Cloud, Check, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherData {
  current: {
    temperature: number;
    windSpeed: number;
    weatherCode: number;
    precipitation: number;
  };
  daily: {
    date: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    windMax: number;
    weatherCode: number;
  }[];
}

const WMO_CODES: Record<number, { label: string; icon: typeof Sun }> = {
  0: { label: "Clear sky", icon: Sun },
  1: { label: "Mainly clear", icon: Sun },
  2: { label: "Partly cloudy", icon: Cloud },
  3: { label: "Overcast", icon: Cloud },
  45: { label: "Foggy", icon: Cloud },
  48: { label: "Rime fog", icon: Cloud },
  51: { label: "Light drizzle", icon: CloudRain },
  53: { label: "Drizzle", icon: CloudRain },
  55: { label: "Dense drizzle", icon: CloudRain },
  61: { label: "Slight rain", icon: CloudRain },
  63: { label: "Moderate rain", icon: CloudRain },
  65: { label: "Heavy rain", icon: CloudRain },
  71: { label: "Slight snow", icon: CloudSnow },
  73: { label: "Moderate snow", icon: CloudSnow },
  75: { label: "Heavy snow", icon: CloudSnow },
  77: { label: "Snow grains", icon: CloudSnow },
  80: { label: "Rain showers", icon: CloudRain },
  81: { label: "Moderate showers", icon: CloudRain },
  82: { label: "Violent showers", icon: CloudRain },
  85: { label: "Snow showers", icon: CloudSnow },
  86: { label: "Heavy snow showers", icon: CloudSnow },
  95: { label: "Thunderstorm", icon: CloudRain },
  96: { label: "Thunderstorm + hail", icon: CloudRain },
  99: { label: "Thunderstorm + heavy hail", icon: CloudRain },
};

function getWeatherInfo(code: number) {
  return WMO_CODES[code] || { label: "Unknown", icon: Cloud };
}

function isIdealDay(day: { tempMax: number; precipitation: number; windMax: number }) {
  return day.tempMax >= 5 && day.tempMax <= 20 && day.precipitation < 20 && day.windMax < 30;
}

interface LiveWeatherProps {
  latitude: number;
  longitude: number;
  trekId: string;
}

export default function LiveWeather({ latitude, longitude, trekId }: LiveWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cacheKey = `weather-${trekId}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
          setWeather(parsed.data);
          setLoading(false);
          return;
        }
      } catch {}
    }

    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code&timezone=auto&forecast_days=7`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Failed");
        const data = await resp.json();

        const parsed: WeatherData = {
          current: {
            temperature: data.current.temperature_2m,
            windSpeed: data.current.wind_speed_10m,
            weatherCode: data.current.weather_code,
            precipitation: data.current.precipitation,
          },
          daily: data.daily.time.map((date: string, i: number) => ({
            date,
            tempMax: data.daily.temperature_2m_max[i],
            tempMin: data.daily.temperature_2m_min[i],
            precipitation: data.daily.precipitation_sum[i],
            windMax: data.daily.wind_speed_10m_max[i],
            weatherCode: data.daily.weather_code[i],
          })),
        };

        setWeather(parsed);
        sessionStorage.setItem(cacheKey, JSON.stringify({ data: parsed, timestamp: Date.now() }));
      } catch {
        setError(true);
      }
      setLoading(false);
    };

    fetchWeather();
  }, [latitude, longitude, trekId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <CloudSun className="h-12 w-12 text-foreground/20 mx-auto mb-3" />
        <h3 className="text-lg font-display mb-2">Weather data unavailable</h3>
        <p className="text-sm text-muted-foreground">Check back later for live weather conditions.</p>
      </div>
    );
  }

  const currentInfo = getWeatherInfo(weather.current.weatherCode);
  const CurrentIcon = currentInfo.icon;
  const idealDays = weather.daily.filter(isIdealDay);

  const chartData = weather.daily.map((d) => ({
    day: new Date(d.date).toLocaleDateString("en", { weekday: "short" }),
    max: d.tempMax,
    min: d.tempMin,
    precip: d.precipitation,
    ideal: isIdealDay(d),
  }));

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg">
          <CloudSun className="h-5 w-5 text-primary" /> Current Weather
        </h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <CurrentIcon className="h-10 w-10 text-primary" />
            <div>
              <div className="text-3xl font-display font-bold">{weather.current.temperature}°C</div>
              <div className="text-xs text-muted-foreground">{currentInfo.label}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-primary" />
              <span>{weather.current.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-primary" />
              <span>{weather.current.precipitation} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg">
          <Thermometer className="h-5 w-5 text-primary" /> 7-Day Forecast
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}°`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
                      <div className="font-medium">{d.day}</div>
                      <div className="mt-1">High: <span className="text-primary font-bold">{d.max}°C</span></div>
                      <div>Low: <span className="font-bold">{d.min}°C</span></div>
                      <div>Rain: {d.precip}mm</div>
                      <div className={d.ideal ? "text-primary font-medium mt-1" : "text-destructive font-medium mt-1"}>
                        {d.ideal ? "✓ Ideal for trekking" : "✗ Not ideal"}
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="max" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.ideal ? "hsl(152, 35%, 40%)" : "hsl(0, 60%, 50%)"} opacity={0.7} />
                ))}
              </Bar>
              <Bar dataKey="min" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.ideal ? "hsl(152, 35%, 28%)" : "hsl(0, 40%, 35%)"} opacity={0.5} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Trekking Window */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg">
          <Sun className="h-5 w-5 text-primary" /> Best Trekking Window (Next 7 Days)
        </h3>
        {idealDays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No ideal trekking days in the next week. Consider waiting for better conditions.</p>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {weather.daily.map((d) => {
              const ideal = isIdealDay(d);
              const dayInfo = getWeatherInfo(d.weatherCode);
              const DayIcon = dayInfo.icon;
              return (
                <div
                  key={d.date}
                  className={`rounded-lg p-2 text-center text-xs border ${
                    ideal
                      ? "border-primary/30 bg-primary/10"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="font-medium">{new Date(d.date).toLocaleDateString("en", { weekday: "short" })}</div>
                  <DayIcon className={`h-4 w-4 mx-auto my-1 ${ideal ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-[10px]">{d.tempMax}°/{d.tempMin}°</div>
                  <div className="mt-1">
                    {ideal ? <Check className="h-3 w-3 text-primary mx-auto" /> : <X className="h-3 w-3 text-destructive mx-auto" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="text-[10px] text-muted-foreground mt-3">
          Ideal conditions: 5–20°C, &lt;20mm precipitation, &lt;30 km/h wind
        </p>
      </div>
    </div>
  );
}
