SELECT
  Vehicles.Make , Vehicles.Model ,
  COUNT(Sales.SaleId) AS TotalSales ,
  -- (  GREATEST(vehicles.LastSeen , vehicles.FirstSeen) - LEAST(vehicles.LastSeen , vehicles.FirstSeen)  ) AS turnover ,
  (Vehicles.LastSeen - Vehicles.FirstSeen) AS Turnover
FROM
  Vehicles
INNER JOIN
  Sales ON Sales.Vin = Vehicles.Vin
