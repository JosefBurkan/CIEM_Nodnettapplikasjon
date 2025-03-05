# Use the .NET SDK image to build the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the backend project file (CSProj) and restore dependencies
COPY ["CIEM_Nodnettapplikasjon.Server/CIEM_Nodnettapplikasjon.Server.csproj", "CIEM_Nodnettapplikasjon.Server/"]

# Restore dependencies for the backend
RUN dotnet restore "CIEM_Nodnettapplikasjon.Server/CIEM_Nodnettapplikasjon.Server.csproj"

# Copy the rest of the backend files
COPY . .

# Publish the backend
WORKDIR "/src/CIEM_Nodnettapplikasjon.Server"
RUN dotnet publish -c Release -o /app/publish

# Use the ASP.NET runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .  # Copy the published files to /app
ENTRYPOINT ["dotnet", "CIEM_Nodnettapplikasjon.Server.dll"]