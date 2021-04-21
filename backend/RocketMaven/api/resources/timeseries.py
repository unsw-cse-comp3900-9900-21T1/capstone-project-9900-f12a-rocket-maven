import datetime

from flask import request
from flask_restful import Resource
from RocketMaven.services import TimeSeriesService


class TimeSeriesResource(Resource):
    def get(self, ticker_symbol, range):
        """
        ---
        summary: Get stock price time series
        description: Get stock price time series using predefined range
        tags:
          - TimeSeries
        parameters:
          - in: path
            name: ticker_symbol
            schema:
              type: string
          - in: path
            name: range
            description: Pre-defined time range for chart data (1d, 5d, 1mo, 6mo, ytd, 1y, 5y, max)
            schema:
              type: string
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    results:
                      type: array
                      items:
                        type: object
                        properties:
                          timestamp:
                            type: integer
                          datetime:
                            type: string
                          high:
                            type: number
                          volume:
                            type: integer
                          close:
                            type: number
                          open:
                            type: number
                          low:
                            type: number

        """
        return TimeSeriesService.get_timeseries_data(ticker_symbol, range)


class AdvancedTimeSeriesResource(Resource):
    def get(self, ticker_symbol):
        """
        ---
        summary: Get stock price time series using custom range and interval
        description: Get stock price time series by specifying a start/end date and interval
        tags:
          - TimeSeries
        parameters:
          - in: path
            name: ticker_symbol
            schema:
              type: string
          - in: query
            name: start
            description: Start date in format YYYYMMDD
            schema:
              type: string
          - in: query
            name: end
            description: End date in format YYYYMMDD
            schema:
              type: string
          - in: query
            name: interval
            description: The time interval between stock prices (default - 1 minute)
        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    results:
                      type: array
                      items:
                        type: object
                        properties:
                          timestamp:
                            type: integer
                          datetime:
                            type: string
                          high:
                            type: number
                          volume:
                            type: integer
                          close:
                            type: number
                          open:
                            type: number
                          low:
                            type: number

        """
        start_date = request.args.get("start", None)
        try:
            start_date = datetime.datetime(
                int(start_date[0:4]), int(start_date[4:6]), int(start_date[6:8])
            )
        except ValueError:
            return {"msg": "Invalid start date"}, 400

        end_date = request.args.get("end", None)
        try:
            end_date = datetime.datetime(
                int(end_date[0:4]), int(end_date[4:6]), int(end_date[6:8])
            )
        except ValueError:
            return {"msg": "Invalid end date"}, 400

        if start_date > end_date:
            return {"msg": "Start date cannot be greater than end date"}, 400

        interval = request.args.get("interval", "1m")
        try:
            interval = TimeSeriesService.TimeSeriesInterval(interval)
        except Exception:
            return {"msg": "Invalid interval"}, 400

        return TimeSeriesService.get_timeseries_data_advanced(
            ticker_symbol, start_date, end_date, interval
        )


class DailyTimeSeriesResource(Resource):
    def get(self, ticker_symbol):
        """
        ---
        summary: Get the stock price in a 24-hour period
        description: Get the stock price in a 24-hour period with an interval of a minute
        tags:
          - TimeSeries
        parameters:
          - in: path
            name: ticker_symbol
            schema:
              type: string

        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    results:
                      type: array
                      items:
                        type: object
                        properties:
                          timestamp:
                            type: integer
                          datetime:
                            type: string
                          high:
                            type: number
                          volume:
                            type: integer
                          close:
                            type: number
                          open:
                            type: number
                          low:
                            type: number
        """
        return TimeSeriesService.get_daily_minute(ticker_symbol)


class WeeklyTimeSeriesResource(Resource):
    def get(self, ticker_symbol):
        """
        ---
        summary: Get the stock price in a 7 day period
        description: Get the stock price in a 7 day period with an interval of five minutes
        tags:
          - TimeSeries
        parameters:
          - in: path
            name: ticker_symbol
            schema:
              type: string

        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    results:
                      type: array
                      items:
                        type: object
                        properties:
                          timestamp:
                            type: integer
                          datetime:
                            type: string
                          high:
                            type: number
                          volume:
                            type: integer
                          close:
                            type: number
                          open:
                            type: number
                          low:
                            type: number
        """
        return TimeSeriesService.get_weekly_fiveminute(ticker_symbol)


class MonthlyTimeSeriesResource(Resource):
    def get(self, ticker_symbol):
        """
        ---
        summary: Get the stock price in a month period
        description: Get the stock price in a month period with an interval of an hour
        tags:
          - TimeSeries
        parameters:
          - in: path
            name: ticker_symbol
            schema:
              type: string

        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    results:
                      type: array
                      items:
                        type: object
                        properties:
                          timestamp:
                            type: integer
                          datetime:
                            type: string
                          high:
                            type: number
                          volume:
                            type: integer
                          close:
                            type: number
                          open:
                            type: number
                          low:
                            type: number
        """
        return TimeSeriesService.get_monthly_hourly(ticker_symbol)


class YearlyTimeSeriesResource(Resource):
    def get(self, ticker_symbol):
        """
        ---
        summary: Get the stock price in a 1 year period
        description: Get the stock price in a 1 year period with an interval of a day
        tags:
          - TimeSeries
        parameters:
          - in: path
            name: ticker_symbol
            schema:
              type: string

        responses:
          200:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    results:
                      type: array
                      items:
                        type: object
                        properties:
                          timestamp:
                            type: integer
                          datetime:
                            type: string
                          high:
                            type: number
                          volume:
                            type: integer
                          close:
                            type: number
                          open:
                            type: number
                          low:
                            type: number
        """
        return TimeSeriesService.get_yearly_daily(ticker_symbol)
