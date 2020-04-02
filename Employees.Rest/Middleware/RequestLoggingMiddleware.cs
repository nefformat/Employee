using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Employees.Rest.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        public RequestLoggingMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<RequestLoggingMiddleware>();
        }
        public async Task Invoke(HttpContext context)
        {
            LogRequest(context);
            await _next(context);
        }
        private void LogRequest(HttpContext context)
        {
            _logger.LogInformation($"Http Request Information:{Environment.NewLine}" +
                           $"Schema:{context.Request.Scheme} " +
                           $"Host: {context.Request.Host} " +
                           $"Path: {context.Request.Path} " +
                           $"QueryString: {context.Request.QueryString} ");
        }
    }
}