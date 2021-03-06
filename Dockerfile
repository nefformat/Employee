FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /app

# Prevent 'Warning: apt-key output should not be parsed (stdout is not a terminal)'
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# install NodeJS 13.x
# see https://github.com/nodesource/distributions/blob/master/README.md#deb
RUN apt-get update -yq 
RUN apt-get install curl gnupg -yq 
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g typescript

COPY *.sln .
COPY Employees.Rest/*.csproj ./Employees.Rest/
COPY Employees.Rest.Tests/*.csproj ./Employees.Rest.Tests/
RUN dotnet restore

COPY Employees.Rest/. ./Employees.Rest/

WORKDIR /app/Employees.Rest/scripts
RUN tsc
RUN cp ./* ../wwwroot/scripts/

WORKDIR /app/Employees.Rest
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
WORKDIR /app
COPY --from=build /app/Employees.Rest/out ./
ENTRYPOINT ["dotnet", "Employees.Rest.dll"]
