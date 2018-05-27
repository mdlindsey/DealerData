SELECT
  -- (  GREATEST(Vehicles.LastSeen , Vehicles.FirstSeen) - LEAST(Vehicles.LastSeen , Vehicles.FirstSeen)  ) AS lot_time ,
  (Vehicles.LastSeen - Vehicles.FirstSeen) AS lot_time,
  Sales.id IS NOT NULL AS is_sold ,
  Vehicles.Make, Vehicles.Model, Vehicles.Price, Vehicles.Miles , Vehicles.Year ,
  Vehicles.FirstSeen , Vehicles.LastSeen ,
  Moves.OldStoreId , Moves.NewStoreId , Moves.created
FROM Vehicles
INNER JOIN Moves ON Vehicles.Vin = Moves.Vin
LEFT JOIN Sales ON Vehicles.Vin = Sales.Vin
