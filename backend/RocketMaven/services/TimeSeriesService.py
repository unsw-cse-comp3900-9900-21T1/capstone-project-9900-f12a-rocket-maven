import enum
import datetime
import requests
from cachetools import cached, TTLCache

YAHOO_TIMESERIES_API = "https://query1.finance.yahoo.com/v8/finance/chart/{ticker_symbol}?symbol={ticker_symbol}&period1={start}&period2={end}&useYfid=true&interval={interval}&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US&corsDomain=finance.yahoo.com"

YAHOO_CHART_API = "https://query1.finance.yahoo.com/v8/finance/chart/{ticker_symbol}?region=US&lang=en-US&includePrePost=false&interval={interval}&useYfid=true&range={range}&corsDomain=finance.yahoo.com&.tsrc=finance"

class TimeSeriesInterval(enum.Enum):
    OneMinute = "1m"
    FiveMinutes = "5m"
    FifteenMinutes = '15m'
    OneHour = "60m"
    OneDay = "1d"
    OneWeek = "1wk"
    OneMonth = "1m"
    OneYear = "1y"

ChartSettings = {
    "1d": "2m",
    "5d": "15m",
    "1mo": "30m",
    "6mo": "1d",
    "ytd": "1d",
    "1y": "1d",
    "5y": "1wk",
    "max": "1m"
}

# Cache for 1 minute
@cached(cache=TTLCache(maxsize=1024, ttl=60))
def get_timeseries_data(ticker_symbol, data_range):
    """ Query the Yahoo Finance API for timeseries data using a preset range and interval (see ChartSettings for valid combinations where data_range is the key) """
    if data_range not in ChartSettings:
        return { 'msg': 'Invalid range' }, 400
    interval = ChartSettings[data_range]

    try: 
        exchange, stock = ticker_symbol.split(":")
        if exchange == "" or stock == "":
            return { 'msg': 'Invalid ticker symbol format'}, 400
    except:
        return { 'msg': 'Invalid ticker symbol format'}, 400

    if exchange != "VIRT":
        # For finance yahoo, the ticker needs to be formatted according to its exchange
        if exchange == "CRYPTO":
            # For CRYPTO, the price is the current USD value (similar to how forex works)
            ticker = "-".join([stock, "USD"])
        elif exchange == "ASX":
            # For the ASX, the ticker is a combination of the asset code and ".AX"
            ticker = ".".join([stock, "AX"])
        else:
            # For american? stocks it is just the plain asset code
            ticker = stock

        endpoint = YAHOO_CHART_API.format(ticker_symbol=ticker,
                                interval=interval,
                                range=data_range)
        print(endpoint)

        try:
            response = requests.get(endpoint)
            if response.status_code == 200:
                data = response.json()
                if "timestamp" not in data["chart"]["result"][0]:
                    return { "msg": "No data" }, 400
                print(data["chart"]["result"][0]["timestamp"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["high"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["volume"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["close"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["open"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["low"])
                try:
                    err = data["chart"]["error"]
                    results = []
                    if err is not None:
                        return "Error with API response {}".format(err), 400
                    for timestamp, high, volume, close, open, low in zip(
                        data["chart"]["result"][0]["timestamp"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["high"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["volume"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["close"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["open"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["low"]):
                        results.append({
                            "timestamp": timestamp,
                            "datetime": str(datetime.datetime.utcfromtimestamp(timestamp)),
                            "high": high,
                            "volume": volume,
                            "close": close,
                            "open": open,
                            "low": low
                        })
                    return { "results": results }, 200
                except IndexError:
                    return { "msg": "Malformed API response" }, 400
        except Exception as err:
            return { "msg": "Error obtaining stock time series data - {}".format(err) }, 400


# Cache for 1 minute
@cached(cache=TTLCache(maxsize=1024, ttl=60))
def get_timeseries_data_advanced(ticker_symbol: str, start: datetime.datetime, end: datetime.datetime, interval: TimeSeriesInterval):
    
    exchange, stock = ticker_symbol.split(":")

    if exchange != "VIRT":
        # For finance yahoo, the ticker needs to be formatted according to its exchange
        if exchange == "CRYPTO":
            # For CRYPTO, the price is the current USD value (similar to how forex works)
            ticker = "-".join([stock, "USD"])
        elif exchange == "ASX":
            # For the ASX, the ticker is a combination of the asset code and ".AX"
            ticker = ".".join([stock, "AX"])
        else:
            # For american? stocks it is just the plain asset code
            ticker = stock

        endpoint = YAHOO_TIMESERIES_API.format(ticker_symbol=ticker,
                                start=int(start.timestamp()),
                                end=int(end.timestamp()),
                                interval=interval.value)
        print(endpoint)

        try:
            response = requests.get(endpoint)
            if response.status_code == 200:
                data = response.json()
                if "timestamp" not in data["chart"]["result"][0]:
                    return { "msg": "No data" }, 400
                print(data["chart"]["result"][0]["timestamp"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["high"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["volume"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["close"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["open"])
                print(data["chart"]["result"][0]["indicators"]["quote"][0]["low"])
                try:
                    err = data["chart"]["error"]
                    results = []
                    if err is not None:
                        return "Error with API response {}".format(err), 400
                    for timestamp, high, volume, close, open, low in zip(
                        data["chart"]["result"][0]["timestamp"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["high"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["volume"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["close"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["open"],
                        data["chart"]["result"][0]["indicators"]["quote"][0]["low"]):
                        results.append({
                            "timestamp": timestamp,
                            "datetime": str(datetime.datetime.utcfromtimestamp(timestamp)),
                            "high": high,
                            "volume": volume,
                            "close": close,
                            "open": open,
                            "low": low
                        })
                    return { "results": results }, 200
                except IndexError:
                    return { "msg": "Malformed API response" }, 400
        except Exception as err:
            return { "msg": "Error obtaining stock time series data - {}".format(err) }, 400

# Cache for 1 minute
@cached(cache=TTLCache(maxsize=1024, ttl=60))
def get_daily_minute(ticker_symbol: str):
    """ Get """
    today = datetime.datetime.utcnow()
    start = today - datetime.timedelta(days=1)
    start_date = datetime.datetime(year=start.year, 
                                        month=start.month, 
                                        day=start.day,
                                        hour=start.hour,
                                        minute=start.minute)
    
    end_date = datetime.datetime(year=today.year, 
                                        month=today.month, 
                                        day=today.day,
                                        hour=today.hour,
                                        minute=today.minute)
    print("Daily", str(start_date), str(end_date))
    return get_timeseries_data_advanced(ticker_symbol, start_date, end_date, TimeSeriesInterval.OneMinute)
    
# Cache for 5 minutes
@cached(cache=TTLCache(maxsize=1024, ttl=60 * 5))
def get_weekly_fiveminute(ticker_symbol: str):
    """ """ 
    today = datetime.datetime.utcnow()
    start = today - datetime.timedelta(days=7)
    start_date = datetime.datetime(year=start.year, 
                                        month=start.month, 
                                        day=start.day,
                                        hour=start.hour,
                                        minute=start.minute,
                                        tzinfo=datetime.timezone.utc)
    
    end_date = datetime.datetime(year=today.year, 
                                        month=today.month, 
                                        day=today.day,
                                        hour=today.hour,
                                        minute=today.minute,
                                        tzinfo=datetime.timezone.utc)
    print("Weekly", str(start_date), str(end_date))
    return get_timeseries_data_advanced(ticker_symbol, start_date, end_date, TimeSeriesInterval.FiveMinutes)
    
# Cache for 30 days (1 month)
@cached(cache=TTLCache(maxsize=1024, ttl=60 * 60 * 24 * 30))
def get_monthly_hourly(ticker_symbol: str):
    """ """
    today = datetime.datetime.utcnow()
    start = today - datetime.timedelta(days=30)
    start_date = datetime.datetime(year=start.year, 
                                        month=start.month, 
                                        day=start.day,
                                        hour=start.hour,
                                        tzinfo=datetime.timezone.utc)
    
    end_date = datetime.datetime(year=today.year, 
                                        month=today.month, 
                                        day=today.day,
                                        hour=today.hour,
                                        tzinfo=datetime.timezone.utc)
    print("Monthly", str(start_date), str(end_date))
    return get_timeseries_data_advanced(ticker_symbol, start_date, end_date, TimeSeriesInterval.OneHour)

# Cache for 365 days (1 year)
@cached(cache=TTLCache(maxsize=1024, ttl=60 * 60 * 24 * 365))
def get_yearly_daily(ticker_symbol: str):
    """ """
    today = datetime.datetime.utcnow()
    start = today - datetime.timedelta(days=365)
    start_date = datetime.datetime(year=start.year, 
                                        month=start.month, 
                                        day=start.day,
                                        tzinfo=datetime.timezone.utc)
    
    end_date = datetime.datetime(year=today.year, 
                                        month=today.month, 
                                        day=today.day,
                                        tzinfo=datetime.timezone.utc)
    print("Yearly", str(start_date), str(end_date))
    return get_timeseries_data_advanced(ticker_symbol, start_date, end_date, TimeSeriesInterval.OneDay)
 