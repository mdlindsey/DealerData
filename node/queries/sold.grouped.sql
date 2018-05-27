SELECT
  Vehicles.Make,
  Vehicles.Model,
  COUNT(Sales.Vin) AS Sales,
  SUM(Vehicles.Price) AS Gross,
  AVG(Vehicles.Year) AS AverageYear,
  AVG(Vehicles.Price) AS AveragePrice,
  AVG(CAST(Vehicles.Miles AS UNSIGNED)) AS AverageMiles,
  AVG((Vehicles.LastSeen - Vehicles.FirstSeen)) AS AverageTurnover
FROM
  Vehicles
LEFT JOIN Sales ON Sales.Vin = Vehicles.Vin
