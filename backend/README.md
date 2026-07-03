# CartagoAgency.API

## Run
```bash
dotnet restore
dotnet run
```

The API uses SQL Server from `appsettings.json`.

## Default admin
- email: `admin@cartagoagency.com`
- password: `Admin123!`

## Notes
- `EnsureCreated()` seeds demo data automatically.
- Public pages work without login.
- Admin pages require JWT.
