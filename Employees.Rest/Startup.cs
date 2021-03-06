using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Employees.Rest.Infra;
using Employees.Rest.Middleware;
using Serilog.Extensions.Logging.File;

namespace Employees.Rest
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<Settings>(Configuration);
            services.AddTransient<IEmployeesRepo, SqlEmployeesRepo>();
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, ILogger<Startup> logger)
        {
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseMiddleware<RequestResponseLoggingMiddleware>();

            if (env.IsDevelopment())
            {
                logger.LogInformation("In Development environment");
                // Logging to file enable only in development coz in prod docker use stdout logging driver
                loggerFactory.AddFile("Logs/log-{Date}.txt");
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
