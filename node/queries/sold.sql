SELECT
  Vehicles.Make, Vehicles.Model, Vehicles.Price, Vehicles.Miles , Vehicles.Year , Vehicles.ExteriorColor ,
  Vehicles.FirstSeen , Vehicles.LastSeen , (Vehicles.LastSeen - Vehicles.FirstSeen) AS Turnover,
  Vehicles.EngineSize, Vehicles.Cylinders
FROM Vehicles
INNER JOIN Sales
  ON Sales.Vin = Vehicles.Vin
