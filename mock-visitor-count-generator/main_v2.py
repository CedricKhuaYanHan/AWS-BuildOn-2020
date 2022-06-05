from random import randint

month = ["01", "02", "03", "04", "05",
         "06", "07", "08", "09", "10", "11", "12"]
day = ["01", "02", "03", "04", "05", "06", "07",
       "08", "09"] + [str(i) for i in range(10, 32)]
hour = ["00", "01", "02", "03", "04", "05", "06", "07", "08",
        "09", "10", "11", "12"] + [str(i) for i in range(13, 24)]

timeseries = ["{}-{}-{} {}:00:00".format("2020", month[(
    i // (31*24)) % 12], day[(i//24) % 31], hour[i % 24]) for i in range(8760)]

publicHolidayHours = [11, 12, 13, 17, 18, 19, 587, 588, 589, 593, 594, 595, 611, 612, 613, 617, 618, 619, 2387, 2388, 2389, 2393, 2394, 2395, 2891, 2892, 2893, 2897, 2898, 2899, 3035, 3036, 3037, 3041, 3042, 3043,
                      3419, 3420, 3421, 3425, 3426, 3427, 3443, 3444, 3445, 3449, 3450, 3451, 5075, 5076, 5077, 5081, 5082, 5083, 5315, 5316, 5317, 5321, 5322, 5323, 7619, 7620, 7621, 7625, 7626, 7627, 8603, 8604, 8605, 8609, 8610, 8611]

weekendHours = [i for i in range(8760) if (i // 24) % 7 > 5]

validHours = [i for i in range(8760) if i % 24 == 11 or i % 24 == 12 or i %
              24 == 13 or i % 24 == 17 or i % 24 == 18 or i % 24 == 19]


def mockData(hours):
  data = [0 for i in range(hours)]
  for i in range(len(data)):
    if i in validHours:
      data[i] += randint(2, 5)
    if i in publicHolidayHours:
      data[i] += randint(2, 5)
    if i in weekendHours:
      data[i] += randint(2, 5)
  return data


def main():
    with open("dataFinal.csv", "w") as f:
        data = [mockData(6264) for i in range(220)]
        data = [[str(i) for i in j] for j in data]
        data_csv = ""
        for j in range(len(data[0])):
            for i in range(len(data)):
                data_csv += ",".join([timeseries[j], data[i]
                                      [j], "bed_"+str(i+1)])
                data_csv += '\n'
        f.write(data_csv)


main()
