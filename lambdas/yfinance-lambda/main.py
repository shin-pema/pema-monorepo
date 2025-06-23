import yfinance as yf;

def main():
    dat = yf.Ticker("alv.de");
    print(dat.analyst_price_targets);
    print(dat.recommendations);

if __name__ == "__main__":
    main()