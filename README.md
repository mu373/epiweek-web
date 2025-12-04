# epiweek-web

Simple web calendar for MMWR epidemiological weeks. Supports REST API for converting dates to/from epidemiological weeks.

https://epiweek.vercel.app/

## Features

- Interactive web calendar showing MMWR epiweeks. Click on calendar cells to copy date and epiweek.
- REST API for date/epiweek conversions
- OpenAPI documentation with Swagger UI
- Epiweek calculations powered by [@mu373/epiweek](https://github.com/mu373/epiweek), fully validated against Python's [dralshehri/epiweeks](https://github.com/dralshehri/epiweeks) implementation

## API Documentation

Interactive documentation is available at [`/api/v1/docs`](https://epiweek.vercel.app/api/v1/docs).

### Base URL
```
https://epiweek.vercel.app/api/v1
```

### Endpoints

#### Convert between dates and epiweeks
`GET /epiweek`

Smart bidirectional conversion endpoint. Provide ONE of the following:

- `?date=2024-12-03` - Convert date to epiweek
- `?epiweek=202449` - Convert epiweek string to dates
- `?year=2024&week=49` - Convert year+week to dates

**Example Response (date to epiweek):**
```json
{
  "date": "2024-12-03",
  "epiweek": {
    "year": 2024,
    "week": 49,
    "epiweek": "202449"
  }
}
```

**Example Response (epiweek to dates):**
```json
{
  "epiweek": {
    "year": 2024,
    "week": 49,
    "epiweek": "202449"
  },
  "dateRange": {
    "start": "2024-12-01",
    "end": "2024-12-07"
  },
  "days": [
    {
      "date": "2024-12-01",
      "dayOfWeek": "Sunday",
      "dayNumber": 1
    }
  ]
}
```

#### Batch convert dates to epiweeks
`POST /epiweek/batch`

Convert multiple dates in a single request (max 1000 dates).

**Request Body:**
```json
{
  "dates": ["2024-12-03", "2024-01-15", "2024-06-20"]
}
```

**Response:**
```json
{
  "conversions": [
    {
      "date": "2024-12-03",
      "epiweek": {
        "year": 2024,
        "week": 49,
        "epiweek": "202449"
      }
    }
  ]
}
```

#### Get year calendar
`GET /calendar/{year}`

Retrieve complete calendar data for a year with epiweek information.

**Example:** `GET /calendar/2024`

#### Get month calendar
`GET /calendar/{year}/{month}`

Retrieve calendar data for a specific month (1-12).

**Example:** `GET /calendar/2024/12`

#### Get current epiweek
`GET /current`

Get the current date/time and corresponding epiweek. Defaults to America/New_York timezone.

**Example Response:**
```json
{
  "date": "2025-12-03T02:01:51.504-05:00",
  "timezone": "America/New_York",
  "epiweek": {
    "week": 49,
    "year": 2025,
    "epiweek": "202549"
  }
}
```

#### Get epiweek details
`GET /week/{epiweek}`

Get detailed information about a specific epiweek (format: YYYYWW).

**Example:** `GET /week/202449`

**Example Response:**
```json
{
  "epiweek": "202449",
  "year": 2024,
  "week": 49,
  "dateRange": {
    "start": "2024-12-01",
    "end": "2024-12-07"
  },
  "days": [
    {
      "date": "2024-12-01",
      "dayOfWeek": "Sunday",
      "dayNumber": 1
    }
  ]
}
```

#### Get epiweek range
`GET /range?start={startDate}&end={endDate}`

Get all epiweeks within a date range (inclusive).

**Example:** `GET /range?start=2024-01-01&end=2024-01-31`

**Example Response:**
```json
{
  "start": "2024-01-01",
  "end": "2024-01-31",
  "timezone": "America/New_York",
  "epiweeks": [
    { "week": 1, "year": 2024, "epiweek": "202401" },
    { "week": 2, "year": 2024, "epiweek": "202402" },
    { "week": 3, "year": 2024, "epiweek": "202403" },
    { "week": 4, "year": 2024, "epiweek": "202404" },
    { "week": 5, "year": 2024, "epiweek": "202405" }
  ],
  "totalWeeks": 5
}
```

## Development

```bash
pnpm install
pnpm dev
```

## License
MIT License
