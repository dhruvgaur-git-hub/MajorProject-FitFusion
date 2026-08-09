FROM mcr.microsoft.com/dotnet/sdk:10.0 AS builder
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=builder /app/publish .
ENV ASPNETCORE_URLS=http://+:8082
EXPOSE 8082
ENTRYPOINT ["dotnet", "PrintInvoiceService.dll"]