from random import randint

def mockVisitationData(period, startDay = 0): # period is in days,startDay: 0 represents monday, 6 represents Sunday
    numberOfVisitors = [randint(5,10) for i in range(period)] # starts from day 1, a Monday
    
    # account for spikes in weekends
    for i in range(period):
        if (i - startDay) % (7) >= (5):
            numberOfVisitors[i] += randint(3,5)
    
    #account for spikes in public holidays
    publicHolidays = [0, 24, 25, 99, 120, 126, 142, 143, 211, 221, 317, 358]
        
    for i in range(period):
        if i in publicHolidays:
            numberOfVisitors[i] += randint(3,5)
            
    return numberOfVisitors

def main():
    with open("test.csv", "w") as f:
        data = [mockVisitationData(12*28*24, 0) for i in range(1000)]
        data = [[str(i) for i in j] for j in data]
        year = [2020, 2021]
        month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
        day = ["01", "02", "03", "04", "05", "06", "07", "08", "09"] + [str(i) for i in range(10, 32)]
        hour = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"] + [str(i) for i in range(13,24)]
        timeseries = ["{}-{}-{} {}:00:00".format(year[0], month[(i // (31*24)) % 12], day[(i//24)%31], hour[(i)%24]) for i in range(len(data[0]))]
        data_csv = ""
        for j in range(len(data[0])):
            for i in range(1000):
                data_csv += ",".join([timeseries[j], data[i][j], "client_"+str(i)])
                data_csv += '\n'
        f.write(data_csv)

main()
