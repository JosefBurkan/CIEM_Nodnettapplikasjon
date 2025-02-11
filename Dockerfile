FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY CIEM.NodnettApplikasjon.server/ CIEM.NodnettApplikasjon.server/
WORKDIR /src/CIEM.NodnettApplikasjon.server/
RUN dotnet restore
RUN dotnet build -c Release --no-restore

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CIEM.NodnettApplikasjon.server.dll"]
