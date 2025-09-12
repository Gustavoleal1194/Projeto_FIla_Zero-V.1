# Use the official .NET 8.0 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Use the official .NET 8.0 SDK as build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["FilaZero.Web/FilaZero.Web.csproj", "FilaZero.Web/"]
COPY ["FilaZero.Application/FilaZero.Application.csproj", "FilaZero.Application/"]
COPY ["FilaZero.Domain/FilaZero.Domain.csproj", "FilaZero.Domain/"]
COPY ["FilaZero.Infrastructure/FilaZero.Infrastructure.csproj", "FilaZero.Infrastructure/"]
RUN dotnet restore "FilaZero.Web/FilaZero.Web.csproj"
COPY . .
WORKDIR "/src/FilaZero.Web"
RUN dotnet build "FilaZero.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FilaZero.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FilaZero.Web.dll"]
