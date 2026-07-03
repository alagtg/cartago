FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/CartagoAgency.API/CartagoAgency.API.csproj backend/CartagoAgency.API/
RUN dotnet restore backend/CartagoAgency.API/CartagoAgency.API.csproj

COPY . .
RUN dotnet publish backend/CartagoAgency.API/CartagoAgency.API.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENV PORT=8080

ENTRYPOINT ["dotnet", "CartagoAgency.API.dll"]